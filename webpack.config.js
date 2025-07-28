// SPDX-FileCopyrightText: 2023 Havs- och vattenmyndigheten
// SPDX-FileCopyrightText: 2025 Försäkringskassan
//
// SPDX-License-Identifier: MIT

const buildSettings = require("./buildSettings.json");
const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { cacert: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  if (env.ver) {
    version = env.ver;
  } else {
    version = buildSettings.version;
  }
  source = false;
  if (dev) {
    source = "source-map";
    id = buildSettings.devAppId;
    version = buildSettings.devVersion;
    configUrl = buildSettings.devUrlRemoteConfigServer + "v" + version;
    baseUrl = buildSettings.devBaseUrl;
    pluginUrl = buildSettings.devUrlRemotePluginServer + "v" + version;
    displayName = buildSettings.devDisplayName;
  } else {
    id = buildSettings.prodAppId;
    configUrl = buildSettings.prodUrlConfig + "v" + version;
    baseUrl = buildSettings.prodBaseUrl;
    pluginUrl = buildSettings.prodUrlPlugin + "v" + version;
    displayName = buildSettings.prodDisplayName;
  }

  const config = {
    devtool: source,
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      commands: "./src/commands/commands.ts",
    },
    output: {
      clean: true,
      path: path.resolve(__dirname, "dist/v" + version),
    },
    resolve: {
      extensions: [".ts", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifests/*.xml",
            to: "manifests/[name]/manifest" + "[ext]",
            transform(content) {
              content = content
                .toString()
                .replace(new RegExp("{PROJECT_BASE_URL}", "g"), pluginUrl)
                .replace(new RegExp("{SUPPORT_URL}", "g"), buildSettings.supportUrl)
                .replace(new RegExp("(<Version>).*(</Version>)", "g"), "$1" + version + "$2")
                .replace(new RegExp("(<Id>).*(</Id>)", "g"), "$1" + id + "$2")
                .replace(new RegExp("(<ProviderName>).*(</ProviderName>)", "g"), "$1" + buildSettings.providerName + "$2")
                .replace(new RegExp('(<DisplayName DefaultValue=").*("/>)', "g"), "$1" + displayName + "$2");
              do {
                previous = content;
                content = content.toString().replace(new RegExp("<!--[\\s\\W\\w]+--!?>", "gm"), ""); // Remove commented lines
              } while (content !== previous);
              content.toString().replace(new RegExp("^\n|^\r\n|^\r", "gm"), ""); // Fix end of line
              return content;
            },
          },
          {
            from: "configs/*.json",
            to: "configs/v" + version + "/[name]/config[ext]",
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["pollyfill", "commands"],
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      https: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  return config;
};
