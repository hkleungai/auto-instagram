import { MaybeLookup } from "canvas-common";

const lookup = new MaybeLookup<Record<string, string>>(
    { 'KEY_1': 'VAL_1', 'KEY_2': 'VAL_2' },
    'custom-lookup',
).get();

console.log("lookup['KEY_1']");
// should run try block
try { console.log(lookup['KEY_1']) } catch (error) { console.error(error) };

console.log("lookup['NON_KEY']");
// should run try block AND catch block
try { console.log(lookup['NON_KEY']) } catch (error) { console.error(error) };
