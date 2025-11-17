import z from "zod";
import {
  TemplateConfig,
  TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
  destination_dir: z
    .string()
    .optional()
    .default("")
    .describe(
      "The directory where the template should be located, leave empty when generating root template",
    ),
});

const templateFinalSettingsSchema = templateSettingsSchema;

const templateConfig: TemplateConfig = {
  name: "template",
  description: "A template",
  author: "Timon Teutelink",
  multiInstance: true,
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
  mapFinalSettings: ({ templateSettings }) => ({
    ...templateSettings,
  }),
};

export default templateConfigModule;
