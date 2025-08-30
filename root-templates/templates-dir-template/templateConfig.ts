import z from "zod";
import {
	TemplateConfig,
	TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
	nix: z.boolean().optional().default(false),
	template_dir_name: z.string().optional().default("templates").describe("The name of the template repository directory"),
	template_author_name: z.string().optional().default("Timon Teutelink").describe("The author name to put in the package.json files"),
	template_author_email: z.string().optional().default("timon@teutelink.nl").describe("The author email to put in the package.json files"),
	template_license: z.string().optional().default("MIT").describe("The license to put in the package.json files"),
	template_description: z.string().optional().default("Cool repository full of templates.").describe("The description to put in the root package.json file"),
});

export type FinalTemplateSettings = z.infer<typeof templateSettingsSchema>;

const templateConfig: TemplateConfig = {
	name: "templates_dir_template",
	description: "A template to create templates",
	author: "Timon Teutelink",
};

const templateConfigModule: TemplateConfigModule<
	FinalTemplateSettings,
	{},
	typeof templateSettingsSchema
> = {
	templateConfig,
	targetPath: ".",
	templateSettingsSchema,
	mapFinalSettings: ({ templateSettings }) => ({
		...templateSettings,
	}),
	autoInstantiatedSubtemplates: (settings) => settings.nix ? [
		{
			subTemplateName: "nix_devenv",
			mapSettings: () => ({
				unstable_pkgs: false,
				env_vars: [],
				languages: {
					javascript: { bun: true }
				},
			}),
		},
	] : [],
};

export default templateConfigModule;

