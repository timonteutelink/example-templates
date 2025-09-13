import z from "zod";
import {
  TemplateConfig,
  TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
  unstable_pkgs: z.boolean().optional().default(false),
  env_vars: z.array(
    z.object({
      env_name: z.string(),
      env_value: z.string(),
    }),
  ),
  languages: z.object({
    javascript: z.object({
      bun: z.boolean().optional().default(false),
    }).optional().default({
      bun: false,
    }),
  }),
});

const templateFinalSettingsSchema = templateSettingsSchema;

const templateConfig: TemplateConfig = {
  name: "nix_devenv",
  description: "Nix config for any project ever",
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
  mapFinalSettings: ({ templateSettings }) => ({
    ...templateSettings,
  }),
};

export default templateConfigModule;
