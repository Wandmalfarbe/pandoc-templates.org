import pkg from 'json-schema-library';
const { Draft07 } = pkg;
import fs from "fs";

let templatesJson = JSON.parse(fs.readFileSync('./data/templates.json', 'utf8'));
let templatesJsonSchema = JSON.parse(fs.readFileSync('./data/templates.schema.json', 'utf8'));

const jsonSchema = new Draft07(templatesJsonSchema);
const errors = jsonSchema.validate(templatesJson);

if (errors.length > 0) {
    console.error(errors);
    throw Error(`Encountered ${errors.length} errors while validation schema for 'templates.json'.`);
}
