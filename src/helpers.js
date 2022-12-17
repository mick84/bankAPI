import * as url from "url";
export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
//console.log(__dirname, __filename);
export const validateBody = (body, model) => {
  if (Object.keys(body).some((key) => !(key in model.schema.paths))) {
    throw new Error("Extra data provided!");
  }
};
