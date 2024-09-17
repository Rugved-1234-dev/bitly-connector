const {
  HttpUtils,
  HttpUtils: { request, successResponse, errorResponse },
  STATUS,
} = require("quickwork-adapter-cli-server/http-library");

const app = {
  name: "Bitly",
  alias: "bitly",
  description: "App Description",
  version: "1",
  config: { authType: "api_key" },
  webhook_verification_required: false,
  internal: false,
  connection: {
    input_fields: () => [
      {
        key: "apiKey",
        name: "API Key",
        controlType: "password",
        required: true,
        type: "string",
        hintText: "Enter API key",
        helpText: "Enter API key",
        isExtendedSchema: false,
      },
    ],

    authorization: {
      type: "api_key",

      credentials: (connection) => {
        return connection.input["apiKey"];
      },
    },
  },
  actions: {
    short_url: {
      description: "Create a short URL link",
      hint: "Create an <b>short URL</b> via <b>Bitly</b>",

      input_fields: () => [
        {
          key: "longUrl",
          name: "Long URL",
          hintText: "Put a long URL which  you want to shorten",
          helpText: "Put a long URL which  you want to shorten",
          required: true,
          type: "string",
          controlType: "text",
          isExtendedSchema: false,
        },
        {
          key: "domain",
          name: "Domain",
          hintText: "Enter if you want a custom domain or default is bit.ly",
          helpText: "Enter if you want a custom domain or default is bit.ly",
          required: true,
          type: "string",
          controlType: "select",
          isExtendedSchema: false,
          pickList: [["bit.ly", "bit.ly"]],
        },
        {
          key: "group",
          name: "Group GUID",
          hintText: "Select the group guid",
          helpText: "Select the group guid",
          required: true,
          type: "pickList",
          controlType: "select",
          isExtendedSchema: false,
          dynamicPickList: "groups",
        },
      ],

      execute: async (connection, input) => {
        try {
          let postBody = {
            long_url: input.longUrl,
            domain: input.domain,
            group_guid: input.group,
          };
          console.log(postBody);

          const url = `https://api-ssl.bitly.com/v4/shorten`;

          const headers = {
            Authorization: "Bearer " + connection.input.apiKey,
            "Content-Type": "application/json",
          };
          const response = await HttpUtils.request(
            url,
            headers,
            null,
            HttpUtils.HTTPMethods.POST,
            postBody
          );

          if (response.success === true) {
            const responseOject = {
              id: response.body.id,
              short_url: response.body.link,
              long_url: input.longUrl,
              references: {
                group: response.body.references.group,
              },
            };
            return HttpUtils.successResponse(responseOject);
          } else {
            return HttpUtils.errorResponse(response.body, response.statusCode);
          }
        } catch (error) {
          console.log(error);
          return HttpUtils.errorResponse(error.message);
        }
      },

      output_fields: () => app.objectDefinitions.short_url,

      sample_output: (connection) => {},
    },
    get_clicks_url: {
      description: "Get number of clicks for a short URL",
      hint: "Get number of <b>clicks</b> for a <b>short URL</b>",

      input_fields: () => [
        {
          key: "shortUrl",
          name: "Short URL",
          hintText: "Please enter the short  URL to get number of clicks",
          helpText: "Please enter the short URL to get number of clicks",
          type: "string",
          required: true,
          controlType: "text",
        },
      ],
      execute: async (connection, input) => {
        try {
          const url = `https://api-ssl.bitly.com/v4/bitlinks/${input.short_url}/clicks`;

          const headers = {
            Authorization: "Bearer " + connection.input.apiKey,
            "Content-Type": "application/json",
          };
          const response = await HttpUtils.request(
            url,
            headers,
            null,
            HttpUtils.HTTPMethods.GET
          );

          if (response.success === true) {
            return HttpUtils.successResponse(responseOject);
          } else {
            return HttpUtils.errorResponse(response.body, response.statusCode);
          }
        } catch (error) {
          console.log(error);
          return HttpUtils.errorResponse(error.message);
        }
      },

      output_fields: () => [],

      sample_output: (connection) => {},
    },
    expand_url: {
      description: "Get the expanded  URL for a short URL",

      hint: "Get the expanded  URL for a short URL via <b>Bitly</b>",

      input_fields: () => [
        {
          key: "bitLinkId",
          name: "Bitlink ID",
          hintText: "The ID of the shortened URL to which you want to expand. You'll get the ID from the App Data tree.",
          helpText: "The ID of the shortened URL to which you want to expand. You'll get the ID from the App Data tree.",
          type: "string",
          required: true,
          controlType: "text",
        },
      ],
      execute: async (connection, input) => {
        try {
          const url = `https://api-ssl.bitly.com/v4/expand`;
          const body = {
            bitlink_id:  input.bitLinkId,

          }

          const headers = {
            Authorization: "Bearer " + connection.input.apiKey,
            "Content-Type": "application/json",
          };
          const response = await HttpUtils.request(
            url,
            headers,
            null,
            "POST",
            body
          );

          if (response.success === true) {
            return HttpUtils.successResponse(response.body);
          } else {
            return HttpUtils.errorResponse(response.body, response.statusCode);
          }
        } catch (error) {
          console.log(error);
          return HttpUtils.errorResponse(error.message);
        }
      },

      output_fields: () => app.objectDefinitions.expand_url,

      sample_output: (connection) => {},
    },
  },

  triggers: {},

  test: async (connection) => {
    try {
      let headers = {
        Authorization: "Bearer " + connection.input.apiKey,
      };
      let url = "https://api-ssl.bitly.com/v4/user";

      let response = await HttpUtils.request(url, headers);
      if (response.success == true) {
        return HttpUtils.successResponse(response.body);
      } else {
        return HttpUtils.errorResponse(response.message, response.statusCode);
      }
    } catch (error) {
      return HttpUtils.errorResponse(error.message);
    }
  },
  objectDefinitions: {
    short_url: [
      {
        key: "id",
        name: "Id",
        hintText: "Id",
        helpText: "Id",
        isExtendedSchema: false,
        required: false,
        type: "string",
        controlType: "text",
      },
      {
        key: "short_url",
        name: "Short Url",
        hintText: "Short Url",
        helpText: "Short Url",
        isExtendedSchema: false,
        required: false,
        type: "string",
        controlType: "text",
      },
      {
        key: "long_url",
        name: "Long Url",
        hintText: "Long Url",
        helpText: "Long Url",
        isExtendedSchema: false,
        required: false,
        type: "string",
        controlType: "text",
      },
      {
        key: "references",
        name: "References",
        hintText: "References",
        helpText: "References",
        isExtendedSchema: false,
        required: false,
        type: "object",
        controlType: "object",
        properties: [
          {
            key: "group",
            name: "Group",
            hintText: "Group",
            helpText: "Group",
            isExtendedSchema: false,
            required: false,
            type: "string",
            controlType: "text",
          },
        ],
      },
    ],
    expand_url: [
      {
        "key": "created_at",
        "name": "Created At",
        "hintText": "Created At",
        "helpText": "Created At",
        "isExtendedSchema": false,
        "required": false,
        "type": "string",
        "controlType": "text"
      },
      {
        "key": "link",
        "name": "Link",
        "hintText": "Link",
        "helpText": "Link",
        "isExtendedSchema": false,
        "required": false,
        "type": "string",
        "controlType": "text"
      },
      {
        "key": "id",
        "name": "Id",
        "hintText": "Id",
        "helpText": "Id",
        "isExtendedSchema": false,
        "required": false,
        "type": "string",
        "controlType": "text"
      },
      {
        "key": "long_url",
        "name": "Long Url",
        "hintText": "Long Url",
        "helpText": "Long Url",
        "isExtendedSchema": false,
        "required": false,
        "type": "string",
        "controlType": "text"
      }
    ]

  },
  pickLists: {
    groups: async (connection) => {
      try {
        let url = `https://api-ssl.bitly.com/v4/groups`;
        const headers = {
          Authorization: "Bearer " + connection.input.apiKey,
          "Content-Type": "application/json",
        };
        let response = await HttpUtils.request(url, headers, null, "GET");
        if (response.success == true) {
          let list = response.body.groups.map((item) => {
            return [item.name, item.guid];
          });
          return HttpUtils.successResponse(list);
        } else {
          return HttpUtils.errorResponse(response.body, response.statusCode);
        }
      } catch (error) {
        return HttpUtils.errorResponse(error.message);
      }
    },
  },
};

module.exports = app;
