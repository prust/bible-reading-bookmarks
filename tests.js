import assert from 'node:assert';
import generate from './reading-plan-generator.js';
import {books, NAME, ABBR} from './reading-plan-generator.js';

// it should generate a weekday set starting with Fri, then doing Mon-Thu
assert.deepEqual(generate({
  start_bk: 39, // Matthew
  start_ch: 1,
  end_bk: 39,
  end_ch: 5,
  start_date: '2022-05-13',
  ch_speed: [0, 1, 1, 1, 1, 1, 0]
}), [
  {date: '2022-05-13', start_bk: 39, start_ch: 1, end_bk: 39, end_ch: 1}, // Fri
  {date: '2022-05-16', start_bk: 39, start_ch: 2, end_bk: 39, end_ch: 2}, // Mon
  {date: '2022-05-17', start_bk: 39, start_ch: 3, end_bk: 39, end_ch: 3},
  {date: '2022-05-18', start_bk: 39, start_ch: 4, end_bk: 39, end_ch: 4},
  {date: '2022-05-19', start_bk: 39, start_ch: 5, end_bk: 39, end_ch: 5} // Thu
]);

// it should generate a weekday set that spans a few books
assert.deepEqual(generate({
  start_bk: 59, // 1 Peter
  start_ch: 4,
  end_bk: 65,
  end_ch: 2,
  start_date: '2022-05-15',
  ch_speed: [0, 3, 3, 3, 3, 3, 0]
}), [
  {date: '2022-05-16', start_bk: 59, start_ch: 4, end_bk: 60, end_ch: 1}, // Mon
  {date: '2022-05-17', start_bk: 60, start_ch: 2, end_bk: 61, end_ch: 1},
  {date: '2022-05-18', start_bk: 61, start_ch: 2, end_bk: 61, end_ch: 4},
  {date: '2022-05-19', start_bk: 61, start_ch: 5, end_bk: 63, end_ch: 1},
  {date: '2022-05-20', start_bk: 64, start_ch: 1, end_bk: 65, end_ch: 2}
]);

// OT plan
let plan = generate({
  start_bk: 3,
  start_ch: 5,
  end_bk: 3,
  end_ch: 24,
  start_date: '2022-05-13',
  ch_speed: [4, 2, 2, 2, 2, 2, 4]
});

printPlan(plan);
console.log('');

// NT plan
plan = generate({
  start_bk: 65,
  start_ch: 4,
  end_bk: 65,
  end_ch: 9,
  start_date: '2022-05-13',
  ch_speed: [0, 1, 1, 1, 1, 1, 0]
});

printPlan(plan);

function printPlan(plan) {
  let day_of_wk = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let reading of plan) {
    let date = new Date(`${reading.date}T00:00:00Z`);
    let day = date.getUTCDay();
    let passage;
    if (reading.start_bk == reading.end_bk && reading.start_ch == reading.end_ch)
      passage = `${books[reading.start_bk][ABBR]} ${reading.start_ch}`;
    else if (reading.start_bk == reading.end_bk)
      passage = `${books[reading.start_bk][ABBR]} ${reading.start_ch}-${reading.end_ch}`;
    else
      passage = `${books[reading.start_bk][ABBR]} ${reading.start_ch} - ${books[reading.end_bk][ABBR]} ${reading.end_ch}`;

    console.log(`${day_of_wk[day]} ${reading.date}: ${passage}`);
  }
}
