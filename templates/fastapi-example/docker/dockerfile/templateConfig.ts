import z from "zod";
import {
  TemplateConfig,
  TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
  cache: z.boolean().default(true),
});

const templateFinalSettingsSchema = templateSettingsSchema.extend({
  project_name: z.string().describe("The name of the project"),
});

const templateConfig: TemplateConfig = {
  name: "fastapi_docker",
  description: "Dockerfile for FastAPI application",
  author: "Timon Teutelink",
  specVersion: "1.0.0",
};

const templateConfigModule: TemplateConfigModule<
  {},
  typeof templateSettingsSchema
> = {
  templateConfig,
  targetPath: ".",
  templateSettingsSchema,
  templateFinalSettingsSchema,
  mapFinalSettings: ({ fullProjectSettings, templateSettings }) => ({
    ...templateSettings,
    project_name: fullProjectSettings.projectRepositoryName,
  }),
};

export default templateConfigModule;
