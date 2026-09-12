import {
  HappyOysterModel,
  type AdventureCommand,
  type TravelStateMessage,
  type WorldStateMessage,
} from "@reactor-models/happy-oyster";

export type Translation = NonNullable<AdventureCommand["translation"]>;
export type Rotation = NonNullable<AdventureCommand["rotation"]>;
export type Interaction = NonNullable<AdventureCommand["interaction"]>;

export type WorldAdapterEvents = {
  onPhase?: (phase: string) => void;
  onWorldState?: (state: WorldStateMessage) => void;
  onTravelState?: (state: TravelStateMessage) => void;
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
  private travelState: TravelStateMessage | null = null;

  constructor(events: WorldAdapterEvents = {}) {
    this.model = new HappyOysterModel({ mode: "adventure" });
    if (events.onPhase) this.model.onPhaseChanged(events.onPhase);
    if (events.onWorldState) this.model.onWorldState(events.onWorldState);
    if (events.onStreamError) this.model.onTravelError(events.onStreamError);
    this.model.onTravelState((state) => {
      this.travelState = state;
      events.onTravelState?.(state);
    });
    if (events.onTravelEnd) {
      this.model.onTravelStatusChanged((status) => {
        if (status === "completed" || status === "failed") events.onTravelEnd?.();
      });
    }
  }

  /* Verbs the world itself advertises — environment_actions are things to
     reach for (doors, switches); character_actions are things the player
     body can do. Empty until the travel reports them. */
  get environmentVerbs(): string[] {
    return this.travelState?.environment_actions ?? [];
  }

  get characterVerbs(): string[] {
    return this.travelState?.character_actions ?? [];
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

  /* Resolves once the world reports ready. The URL is the seed frame; the
     model fetches it server-side so it must be publicly reachable — the
     Blob upload path resolves to a session-internal URL upstream cannot
     fetch (action_error 400001). */
  async buildWorld(prompt: string, firstFrameImageUrl: string): Promise<void> {
    await this.model.createWorld({
      prompt,
      firstFrameImageUrl,
      perspective: "first_person",
    });
  }

  /* Renders into the video element; resolves once the stream is open. */
  async start(videoElement: HTMLVideoElement): Promise<void> {
    this.model.attachVideo(videoElement);
    const result = await this.model.startTravel();
    if (!result.streaming) throw new Error("World stream did not open");
  }

  /* Control sends are fire-and-forget; a packet racing the end of a
     travel rejects, which is expected — log it low rather than letting an
     unhandled rejection surface. A broken live stream still reports via
     onTravelError. */
  private send(command: Promise<unknown>): void {
    void command.catch((error) => console.debug("World control dropped:", error));
  }

  move(direction: Translation): void {
    this.send(this.model.move(direction));
  }

  look(direction: Rotation): void {
    this.send(this.model.look(direction));
  }

  interact(verb: Interaction): void {
    this.send(this.model.interact(verb));
  }

  hold(axes: AdventureCommand): void {
    this.send(this.model.hold(axes));
  }

  release(axes: { translation?: true; rotation?: true; interaction?: true }): void {
    this.send(this.model.release(axes));
  }

  stopAll(): void {
    this.send(this.model.stop());
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
