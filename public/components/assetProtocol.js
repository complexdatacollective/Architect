const { protocol, app, net } = require("electron");
const path = require("node:path");
const log = require("./log");

const protocolName = "asset"; // e.g. `asset://`

const validPaths = [app.getPath("userData"), app.getPath("temp")];

const isValidPath = (filePath) => validPaths.some((validPath) => filePath.includes(validPath));

const registerProtocol = () => {
	try {
		protocol.handle(protocolName, async (request) => {
			const urlPath = request.url.substring(protocolName.length + 3);
			const decodedPath = decodeURIComponent(urlPath);
			const filePath = path.normalize(decodedPath);

			if (!isValidPath(filePath)) {
				log.error(`path outside of valid directories: "${filePath}"`);
				return new Response("Forbidden", { status: 403 });
			}

			try {
				log.info(`open ${protocolName}://`, filePath);
				return net.fetch(`file://${filePath}`);
			} catch (error) {
				log.error(error);
				return new Response("Not Found", { status: 404 });
			}
		});
		log.info(`${protocolName}:// protocol registered successfully`);
	} catch (error) {
		log.error(`Failed to register ${protocolName}:// protocol:`, error.message);
	}
};

exports.registerProtocol = registerProtocol;
