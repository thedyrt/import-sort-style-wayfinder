module.exports = function(styleApi) {
  const {
    and,
    or,
    hasDefaultMember,
    hasNoMember,
    hasOnlyNamespaceMember,
    isAbsoluteModule,
    isRelativeModule,
    isScopedModule,
    moduleName,
    not,
    startsWithLowerCase,
    startsWithUpperCase,
    startsWith,
    naturally
  } = styleApi;

  function equals(name) {
    return text => {
      return text === name;
    };
  }

  function isTypeModule(imported) {
    return imported.type === "import-type";
  }

  function isWayfinderModule(imported) {
    console.log(imported.moduleName.split('/')[0])
    const moduleName = imported.moduleName.split('/')[0];
    return ["@actions",
      "@actionTypes",
      "@api",
      "@components",
      "@config",
      "@constants",
      "@deepLink",
      "@errors",
      "@hooks",
      "@middleware",
      "@reducers",
      "@package.json",
      "@screens",
      "@storage",
      "@services",
      "@themes",
      "@utils"
    ].includes(moduleName)
  }

  return [
    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },
    { separator: true },

    // import React, {foo} from "react";
    {
      match: and(
        hasDefaultMember,
        moduleName(equals("react")),
        not(isTypeModule)
      ),
      sort: moduleName(naturally)
    },

    // import {foo} from "react-*"
    {
      match: and(moduleName(equals("react-native"))),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import type foo from "bar";
    {
      match: and(isTypeModule),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import foo from "bar";
    {
      match: and(
        or(isAbsoluteModule, isScopedModule),
        not(isTypeModule),
        not(isWayfinderModule),
        moduleName(startsWithLowerCase)
      ),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import * as foo from "utils/bar";
    {
      match: and(isWayfinderModule, hasOnlyNamespaceMember),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import { foo } from "utils/bar";
    {
      match: and(
        isWayfinderModule,
        not(moduleName(startsWith("@component"))),
        not(moduleName(startsWith("@screens")))
      ),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import { bar } from "screens/bar";
    {
      match: and(isWayfinderModule, moduleName(startsWith("@screens"))),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import { bar } from "components/bar";
    {
      match: and(isWayfinderModule, moduleName(startsWith("@component"))),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import foo from "./bar";
    {
      match: and(isRelativeModule),
      sort: moduleName(naturally)
    }
  ];
};