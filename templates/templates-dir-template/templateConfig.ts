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

const templateFinalSettingsSchema = templateSettingsSchema.extend({
	project_name: z.string().describe("The name of the project"),
});

const templateConfig: TemplateConfig = {
	name: "templates_dir_template",
	description: "A template to create templates",
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
		project_name: fullProjectSettings.projectName,
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

