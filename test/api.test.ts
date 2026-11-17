// Run with: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build, validate, describe } from '../elevate/core/api.ts';

// Compiles class strings as if each were one element in a template, without
// touching any files.
const compile = async (...elements: string[]) => {
  const result = await build({ write: false, files: false, extra: elements });
  assert.equal(result.ok, true, result.error);
  return result.css;
};

test('validate accepts valid class strings', () => {
  for (const value of [
    'row gap:d4 /md/ col',
    'text:pink @hover:[text:indigo_bg-color:pink]',
    'bg-img:(linear-gradient(#FF0000,#0000FF))',
    '-plain-class env:card ctx:list ctx:end',
    'grid:cols-3-fr:gap-d3 /lg/ grid:cols-4-fr',
  ]) {
    const result = validate(value);
    assert.equal(result.ok, true, `${value}: ${result.problems.map((p) => p.message).join('; ')}`);
  }
});

test('validate reports each problem with the class that caused it', () => {
  const cases: [string, string, RegExp][] = [
    ['text:pnk', 'text:pnk', /modifier type for "pnk"/],
    ['gap:d4 /zz/ col', '/zz/', /not a breakpoint/],
    ['nope:d4', 'nope:d4', /Unrecognized property "nope"/],
    ['@hover:[text:pink bg-color:indigo]', '@hover:[text:pink bg-color:indigo]', /underscores/],
    ['@child:[text:pink]', '@child:[text:pink]', /ctx scope/],
    ['@before+after:[text:pink]', '@before+after:[text:pink]', /pseudo-element/],
  ];
  for (const [value, token, message] of cases) {
    const result = validate(value);
    assert.equal(result.ok, false, value);
    assert.equal(result.problems[0].token, token);
    assert.match(result.problems[0].message, message);
  }
});

test('build never throws and never writes when write is false', async () => {
  const bad = await build({ write: false, files: false, extra: ['text:pnk'] });
  assert.equal(bad.ok, false);
  assert.match(bad.error!, /pnk/);
  assert.equal(bad.css, '');
  assert.equal('file' in bad, false);
});

test('a larger breakpoint copy of a class does not leak to other elements', async () => {
  // The list item uses `col` from lg; the list uses `col` at base and grid at lg.
  const css = await compile('col /lg/ grid', 'row /lg/ col');
  const lg = css.slice(css.indexOf('@media only screen and (min-width:64rem)'));
  const colRule = lg.split('\n').find((l) => l.startsWith('.col'));
  assert.ok(colRule, 'lg rule for .col exists');
  assert.match(colRule!, /:where\(/, 'lg .col is limited to its own elements');
});

test('classes with # in a pass-through value compile', async () => {
  const css = await compile('bg-img:(linear-gradient(#FF0000,#0000FF))');
  assert.match(css, /background-image: linear-gradient\(#FF0000,#0000FF\)/);
});

test('fr columns and split never stretch to fit content', async () => {
  const css = await compile('grid:cols-3-fr', 'split');
  assert.match(css, /repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
});

test('describe lists breakpoints, tokens, rules and what each property accepts', () => {
  const d = describe();
  assert.deepEqual(d.breakpoints.map((b) => b.name).slice(0, 3), ['2xs', 'xs', 'sm']);
  assert.equal(typeof d.tokens.ColorToken.pink, 'string');
  assert.ok(d.rules.xAxis['x-center']);
  assert.deepEqual(d.properties['bg-color'].accepts, ['ColorToken']);
  assert.deepEqual(d.properties.pd.accepts, ['SpacingToken']);
  assert.equal(d.properties.block.standalone, true);
  assert.equal(d.properties.translate.passThroughOnly, true);
  // JSON-safe: survives a round trip unchanged
  assert.deepEqual(JSON.parse(JSON.stringify(d)), d);
});

test('attribute states follow aria-current, aria-expanded and open', async () => {
  const css = await compile('text:grey @current:[text:black]', 'hidden @expanded:[block]', 'opacity:0 @open:[opacity:1]');
  assert.match(css, /\[aria-current\]:not\(\[aria-current="false"\]\)/);
  assert.match(css, /\[aria-expanded="true"\]/);
  assert.match(css, /\[open\]/);
  assert.equal(validate('@current:[text:black] @pressed:[bg-color:black]').ok, true);
});

test('font-numeric sets the style of figures', async () => {
  const css = await compile('font-numeric:tabular-nums');
  assert.match(css, /font-variant-numeric:\s*tabular-nums/);
});

test('the hidden attribute beats display classes', async () => {
  const css = await compile('row');
  assert.match(css, /\[hidden\]:not\(\[hidden='until-found'\]\)\s*\{\s*display:\s*none !important;/);
});

test('breakpoints written out of order, or twice, are warned about with the file and line', async () => {
  const fine = await build({ write: false, files: false, extra: ['pd:d2 /md/ pd:d4 /lg/ pd:d6'] });
  assert.deepEqual(fine.warnings.filter((w) => /Breakpoint/.test(w)), []);
  const back = await build({ write: false, files: false, extra: ['pd:d2 /lg/ pd:d6 /md/ pd:d4'] });
  assert.equal(back.ok, true);
  assert.match(back.warnings.join('\n'), /Breakpoints out of order: \/md\/ comes after \/lg\/ in one class list/);
  assert.match(back.warnings.join('\n'), /smallest first/);
  const twice = await build({ write: false, files: false, extra: ['pd:d2 /md/ pd:d4 /md/ gap:d4'] });
  assert.match(twice.warnings.join('\n'), /Breakpoint written twice: \/md\/ appears more than once/);
});

test("a script's own ${…} value inside class quotes is left out, and the classes beside it stay", async () => {
  const { scanSource } = await import('../elevate/core/scan.js');
  const only = scanSource('const a = `<p class="${look}">x</p>`;', 'a.js');
  assert.deepEqual(only.flatMap((m: { classes: string[] }) => m.classes), []);
  const mixed = scanSource('const a = `<p class="row gap:d2 ${extra}">x</p>`;', 'a.js');
  assert.deepEqual(mixed.flatMap((m: { classes: string[] }) => m.classes), ['row', 'gap:d2']);
});
