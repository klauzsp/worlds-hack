import {test} from 'node:test';
import assert from 'node:assert/strict';
import {literalBrief} from '../director.js';
import {promptForScene} from '../public/scene.js';
test('snake consultation leads to animal snakes in the opening and subsequent actions',()=>{
 const brief={fear:'snake (as in the animal)',imagery:'something moving across the floor',intensity:'slow dread',exclusions:'gore'};
 brief.direction=literalBrief(brief);
 for(const action of ['Reveal the subject','Back away slowly']){
  const prompt=promptForScene(brief,action,['look left']);
  assert.match(prompt,/living animal snakes/);assert.match(prompt,/scales/);assert.match(prompt,/hissing/);assert.ok(prompt.includes(action));assert.match(prompt,/moving across the floor/);assert.match(prompt,/gore/);
  assert.doesNotMatch(prompt,/doctor|maze|case.file/i);
 }
});
test('arbitrary fear is preserved rather than replaced by a theme',()=>{
 const brief={fear:'my reflection moving independently',imagery:'bathroom mirror',intensity:'nightmare',exclusions:'spiders'};
 brief.direction=literalBrief(brief);const prompt=promptForScene(brief,'Look into the mirror');
 assert.match(prompt,/my reflection moving independently/);assert.match(prompt,/bathroom mirror/);assert.equal(brief.direction.source,'consultation');
});
test('shark consultation creates underwater shark setting, objective and persistent subject',()=>{
 const brief={fear:'sharks are my biggest fear',imagery:'my dark bedroom',intensity:'strong suspense',exclusions:'gore'};
 brief.direction=literalBrief(brief);
 assert.match(brief.direction.subject,/animal sharks/);assert.match(brief.direction.setting,/underwater/);assert.match(brief.direction.objective,/diving cage/);
 for(const history of [[],['swim away from the shark']]){
  const prompt=promptForScene(brief,'Swim toward the rescue rope',history);
  assert.match(prompt,/REQUIRED VISIBLE SUBJECT: living animal sharks/);assert.match(prompt,/Keep the feared subject clearly visible/);
  assert.match(prompt,/SECONDARY CONSULTATION IMAGERY/);assert.match(prompt,/do not move to a house/);
 }
});
