import z from "zod";
import {
	TemplateConfig,
	TemplateConfigModule,
} from "@timonteutelink/template-types-lib";

const templateSettingsSchema = z.object({
	entity_name: z.string().regex(/^[a-z][a-z_]*$/).optional().default("post").describe("The name of the FastAPI application, used in the Dockerfile"),
});

const templateFinalSettingsSchema = templateSettingsSchema.extend({
	project_name: z.string().describe("The name of the project"),
});

const templateConfig: TemplateConfig = {
	name: "fastapi_api_entity",
	description: "A FastAPI template for a single entity API",
	author: "Timon Teutelink",
	specVersion: "1.0.0",
};

const templateConfigModule: TemplateConfigModule<
	{},
	typeof templateSettingsSchema
> = {
	templateConfig,
	targetPath: settings => `./${settings.entity_name}`,
	templateSettingsSchema,
	templateFinalSettingsSchema,
	mapFinalSettings: ({ fullProjectSettings, templateSettings }) => ({
		...templateSettings,
		project_name: fullProjectSettings.projectName,
	}),
	sideEffects: [
		{
			filePath: "./app/main.py",
			apply: async (settings, fileContents) => {
				if (!fileContents) return null;
				const importStatement = `from .${settings.entity_name} import router as ${settings.entity_name}s_router\n`;
				const includeRouterStatement = `app.include_router(${settings.entity_name}s_router.router)\n`;

				if (fileContents.includes(importStatement) || fileContents.includes(includeRouterStatement)) {
					return null;
				}

				let lines = fileContents.split("\n");
				let insertImportBefore = lines.findIndex(line => line.startsWith("###IMPORT_ROUTER_PLACEHOLDER###"));
				let insertRouterBefore = lines.findIndex(line => line.startsWith("###REGISTER_ROUTER_PLACEHOLDER###"));
				if (insertImportBefore === -1 || insertRouterBefore === -1) {
					throw new Error("Could not find placeholder comments in main.py");
				}

				lines.splice(insertImportBefore - 1, 0, importStatement);
				lines.splice(insertRouterBefore - 1, 0, includeRouterStatement);
				return lines.join("\n");
			}
		}
	]
};

export default templateConfigModule;

