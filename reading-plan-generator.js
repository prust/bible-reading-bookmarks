function assert(value, message) {
  if (!value) throw new Error(message);
}

let NAME = 0;
let ABBR = 1;
let LAST_CH = 2;

let books = [
  ['Genesis', 'Ge', 50],
  ['Exodus', 'Ex', 40],
  ['Leviticus', 'Lev', 27],
  ['Numbers', 'Nu', 36],
  ['Deuteronomy', 'Dt', 34],
  ['Joshua', 'Jos', 24],
  ['Judges', 'Jdg', 21],
  ['Ruth', 'Ru', 4],
  ['1 Samuel', '1Sa', 31],
  ['2 Samuel', '2Sa', 24],
  ['1 Kings', '1Ki', 22],
  ['2 Kings', '2Ki', 25],
  ['1 Chronicles', '1Ch', 29],
  ['2 Chronicles', '2Ch', 36],
  ['Ezra', 'Ezr', 10],
  ['Nehemiah', 'Ne', 13],
  ['Esther', 'Est', 10],
  ['Job', 'Job', 42],
  ['Psalms', 'Ps', 150],
  ['Proverbs', 'Pr', 31],
  ['Ecclesiastes', 'Ecc', 12],
  ['Song of Solomon', 'SS', 8],
  ['Isaiah', 'Isa', 66],
  ['Jeremiah', 'Jer', 52],
  ['Lamentations', 'La', 5],
  ['Ezekiel', 'Eze', 48],
  ['Daniel', 'Da', 12],
  ['Hosea', 'Hos', 14],
  ['Joel', 'Joel', 3],
  ['Amos', 'Am', 9],
  ['Obadiah', 'Ob', 1],
  ['Jonah', 'Jnh', 4],
  ['Micah', 'Mic', 7],
  ['Nahum', 'Na', 3],
  ['Habakkuk', 'Hab', 3],
  ['Zephaniah', 'Zep', 3],
  ['Haggai', 'Hag', 2],
  ['Zechariah', 'Zec', 14],
  ['Malachi', 'Mal', 4],
  ['Matthew', 'Mt', 28], // index 39
  ['Mark', 'Mk', 16],
  ['Luke', 'Lk', 24],
  ['John', 'Jn', 21],
  ['Acts', 'Ac', 28],
  ['Romans', 'Ro', 16],
  ['1 Corinthians', '1Co', 16],
  ['2 Corinthians', '2Co', 13],
  ['Galatians', 'Gal', 6],
  ['Ephesians', 'Eph', 6],
  ['Philippians', 'Phl', 4],
  ['Colossians', 'Col', 4],
  ['1 Thessalonians', '1Th', 5],
  ['2 Thessalonians', '2Th', 3],
  ['1 Timothy', '1Ti', 6],
  ['2 Timothy', '2Ti', 4],
  ['Titus', 'Tit', 3],
  ['Philemon', 'Phm', 1],
  ['Hebrews', 'Heb', 13],
  ['James', 'Jas', 5],
  ['1 Peter', '1Pe', 5],  // #59
  ['2 Peter', '2Pe', 3],  // #60
  ['1 John', '1Jn', 5],   // #61
  ['2 John', '2Jn', 1],   // #62
  ['3 John', '3Jn', 1],   // #63
  ['Jude', 'Jude', 1],       // #64
  ['Revelation', 'Rev', 22] // #65
];

let date_re = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;

function generate(opts) {
  assert(opts && opts.start_bk != null && opts.start_ch && opts.end_bk && opts.end_ch,
    `Options missing required arguments (${JSON.stringify(opts)})`);
  assert(opts.start_bk >= 0 && opts.start_bk < books.length, `Invalid start book: ${opts.start_bk}`);
  assert(opts.end_bk >= 0 && opts.end_bk < books.length, `Invalid end book: ${opts.end_bk}`);
  assert(opts.start_ch >= 1 && opts.start_ch <= books[opts.start_bk][LAST_CH], `Invalid start chapter: ${books[opts.start_bk][NAME]} ${opts.start_ch}`);
  assert(opts.end_ch >= 1 && opts.end_ch <= books[opts.end_bk][LAST_CH], `Invalid end chapter: ${books[opts.end_bk][NAME]} ${opts.end_ch}`);
  
  assert(opts.start_bk <= opts.end_bk, `Start book (${books[opts.start_bk][NAME]}) is after end book (${books[opts.end_bk][NAME]})`);
  if (opts.start_bk == opts.end_bk)
    assert(opts.start_ch <= opts.end_ch, `Start chapter (${opts.start_ch}) is after end chapter (${opts.end_ch}), of the same book`)

  assert(opts.start_date && date_re.test(opts.start_date), `Invalid start date: "${opts.start_date}" (not "YYYY-MM-DD")`);
  let date = fromISODate(opts.start_date);

  assert(opts.ch_speed && opts.ch_speed.length == 7, `Invalid chapter speed: ${opts.ch_speed}`);
  let any_non_zero = false;
  for (let ch_speed of opts.ch_speed) {
    assert(ch_speed >= 0 && ch_speed <= 999, `Invalid chapter speed: ${ch_speed} (from ${JSON.stringify(opts.ch_speed)})`);
    if (ch_speed > 0)
      any_non_zero = true;
  }
  assert(any_non_zero, `You need to read more than 0 chapters on at least one day ${JSON.stringify(opts.ch_speed)}`);

  let plan = [];
  let bk = opts.start_bk;
  let ch = opts.start_ch;
  while (bk < opts.end_bk || (bk == opts.end_bk && ch <= opts.end_ch)) {
    let day_of_wk = date.getDay();
    let num_chapters = opts.ch_speed[day_of_wk];
    if (num_chapters) {
      let reading = {
        date: toISODate(date),
        start_bk: bk,
        start_ch: ch
      };

      ch += num_chapters - 1;
      while (ch > books[bk][LAST_CH] && bk < (books.length - 1)) {
        ch -= books[bk][LAST_CH];
        bk++;
      }

      if (bk > opts.end_bk)
        bk = opts.end_bk;
      if (bk == opts.end_bk && ch > opts.end_ch)
        ch = opts.end_ch;
      reading.end_bk = bk;
      reading.end_ch = ch;

      plan.push(reading);
      ch++;
      if (ch > books[bk][LAST_CH] && bk < (books.length - 1)) {
        ch -= books[bk][LAST_CH];
        bk++;
      }
    }
    date.setDate(date.getDate() + 1);
  }

  return plan;
}

function fromISODate(dt_str) {
  let parts = dt_str.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
}

function toISODate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth()+1)}-${pad2(date.getDate())}`;
}

function pad2(n) {
  return `${n < 10 ? '0' : ''}${n}`;
}

export {books, NAME, ABBR, LAST_CH, toISODate, fromISODate};
export default generate;
