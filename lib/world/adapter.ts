import {
  HappyOysterModel,
  type AdventureCommand,
  type WorldStateMessage,
} from "@reactor-models/happy-oyster";

export type Translation = NonNullable<AdventureCommand["translation"]>;
export type Rotation = NonNullable<AdventureCommand["rotation"]>;
export type Interaction = NonNullable<AdventureCommand["interaction"]>;

export type WorldAdapterEvents = {
  onPhase?: (phase: string) => void;
  onWorldState?: (state: WorldStateMessage) => void;
  onStreamError?: (error: unknown) => void;
  onTravelEnd?: () => void;
};

/*
 * Thin wrapper over HappyOysterModel in adventure mode. Everything the app
 * knows about the world goes through here — the model is a video stream, not
 * a scene graph, so the surface is deliberately small.
 */
export class WorldAdapter {
  private model: HappyOysterModel<"adventure">;

  constructor(events: WorldAdapterEvents = {}) {
    this.model = new HappyOysterModel({ mode: "adventure" });
    if (events.onPhase) this.model.onPhaseChanged(events.onPhase);
    if (events.onWorldState) this.model.onWorldState(events.onWorldState);
    if (events.onStreamError) this.model.onTravelError(events.onStreamError);
    if (events.onTravelEnd) {
      this.model.onTravelStatusChanged((status) => {
        if (status === "completed" || status === "failed") events.onTravelEnd?.();
      });
    }
  }

  get phase(): string {
    return this.model.phase;
  }

  get streaming(): boolean {
    return this.model.streaming;
  }

  async connect(jwt: string): Promise<void> {
    await this.model.connect(jwt);
  }

  /* Resolves once the world reports ready. Image is the seed frame. */
  async buildWorld(prompt: string, firstFrameImage: Blob): Promise<void> {
    await this.model.createWorld({
      prompt,
      firstFrameImage,
      perspective: "first_person",
    });
  }

  /* Renders into the video element; resolves once the stream is open. */
  async start(videoElement: HTMLVideoElement): Promise<void> {
    this.model.attachVideo(videoElement);
    const result = await this.model.startTravel();
    if (!result.streaming) throw new Error("World stream did not open");
  }

  move(direction: Translation): void {
    void this.model.move(direction);
  }

  look(direction: Rotation): void {
    void this.model.look(direction);
  }

  interact(verb: Interaction): void {
    void this.model.interact(verb);
  }

  hold(axes: AdventureCommand): void {
    void this.model.hold(axes);
  }

  release(axes: { translation?: true; rotation?: true; interaction?: true }): void {
    void this.model.release(axes);
  }

  stopAll(): void {
    void this.model.stop();
  }

  /*
   * The single t=30s steering instruction. instruct() is documented for
   * Directing worlds; on Adventure it is the only live text channel, so we
   * fire it once and report whether the model took it. The world prompt
   * already carries the escalation trajectory — see prompt-rules.ts.
   */
  async escalate(text: string): Promise<boolean> {
    try {
      const ack = await this.model.instruct(text);
      return ack.accepted !== false;
    } catch (error) {
      console.error("Escalation instruction rejected:", error);
      return false;
    }
  }

  async end(): Promise<void> {
    this.stopAll();
    try {
      await this.model.endTravelSession();
    } catch {
      /* travel may already be over — the session is ending anyway */
    }
    await this.model.disconnect();
  }
}
