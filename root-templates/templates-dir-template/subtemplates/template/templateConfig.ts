import z from "zod";
import {
	TemplateConfig,
	TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
	destination_dir: z.string().optional().default("").describe("The directory where the template should be located, leave empty when generating root template"),

});

export type FinalTemplateSettings = z.infer<typeof templateSettingsSchema>;

const templateConfig: TemplateConfig = {
	name: "template",
	description: "A template",
	author: "Timon Teutelink",
	multiInstance: true,
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
	})
};

export default templateConfigModule;


