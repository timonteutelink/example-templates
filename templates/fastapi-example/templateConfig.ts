import z from "zod";
import {
  TemplateConfig,
  TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
  package_name: z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .optional()
    .default("my_fastapi_app")
    .describe("The name of the package to put in the pyproject.toml file"),
  package_version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/)
    .optional()
    .default("0.1.0")
    .describe("The version of the package to put in the pyproject.toml file"),
  package_description: z
    .string()
    .optional()
    .default("A FastAPI application")
    .describe(
      "The description of the package to put in the pyproject.toml file",
    ),

  readme_contents: z
    .string()
    .optional()
    .default("# My FastAPI App\n\nThis is a FastAPI application.")
    .describe("The contents of the README.md file"),

  docker: z.boolean().optional().default(false),
});

const templateFinalSettingsSchema = templateSettingsSchema.extend({
  project_name: z.string().describe("The name of the project"),
});

const templateConfig: TemplateConfig = {
  name: "fastapi",
  description: "A FastAPI template",
  author: "Timon Teutelink",
  specVersion: "1.0.0",
  isRootTemplate: true,
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
  autoInstantiatedSubtemplates: (settings) =>
    settings.docker
      ? [
          {
            subTemplateName: "fastapi_docker",
            mapSettings: () => ({}),
          },
        ]
      : [],
};

export default templateConfigModule;
