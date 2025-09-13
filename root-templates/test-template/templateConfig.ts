import z from "zod";
import {
	TemplateConfig,
	TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
	test_boolean: z.boolean().optional().default(false).describe("A boolean to test with"),
	test_string: z.string().describe("A string to test with"),
	test_number: z.number().min(10).max(100).describe("A number to test with"),
	test_object: z.object({
		test_array: z.array(z.object({
			test_string_in_array: z.string().min(5).default("Very nice").describe("A string in an array to test with"),
		})).min(2).default([{ test_string_in_array: "banananananana" }]).describe("An array to test with"),
		more_stuff: z.enum(["option1", "option2", "option3"]).default("option2").describe("An enum to test with"),
	})
})

const coolifyHelper = (str: string) => {
	return str.split('').map((char, index) =>
		index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
	).join('');
};

const templateFinalSettingsSchema = templateSettingsSchema;

const templateConfig: TemplateConfig = {
	name: "test_template",
	description: "A template to create templates",
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
	autoInstantiatedSubtemplates: [
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
	],
	redirects: [
		{
			from: "testlocation/README.md",
			to: "README.md",
		}
	],

	sideEffects: [
		{
			filePath: "README.md",
			apply: async (settings, oldContent) => {
				const nice = settings.test_boolean ? "nice" : "not nice";
				return `${oldContent}\n# This is a ${nice} template`;
			}
		}
	],

	assertions: (settings) => settings.test_boolean,

	commands: [
		{
			title: "Test Command",
			description: "A test command that does nothing",
			command: "echo 'This is a test command'",
		}
	],

	handlebarHelpers: { coolifyHelper }






};

export default templateConfigModule;

