module.exports = function(styleApi) {
  const {
    and,
    hasDefaultMember,
    hasNoMember,
    hasOnlyNamespaceMember,
    isAbsoluteModule,
    isRelativeModule,
    moduleName,
    not,
    startsWithLowerCase,
    startsWithUpperCase,
    startsWith,
    naturally
  } = styleApi;

  function isTypeModule(imported) {
    return imported.type === "import-type";
  }

  function isWayfinderModule(imported) {
    return (
      (!isTypeModule(imported) &&
        (imported.moduleName.indexOf(".") !== 0 &&
          imported.moduleName.indexOf("@") !== 0 &&
          imported.moduleName.indexOf("/") > 0)) ||
      imported.moduleName === "actions" ||
      imported.moduleName === "actionTypes" ||
      startsWithUpperCase(imported.moduleName)
    );
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
        moduleName(startsWith("react")),
        not(isTypeModule)
      ),
      sort: moduleName(naturally)
    },

    // import {foo} from "react-*"
    {
      match: and(moduleName(startsWith("react")), not(isTypeModule)),
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
        isAbsoluteModule,
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
        not(moduleName(startsWith("component"))),
        not(moduleName(startsWith("screens")))
      ),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import { bar } from "screens/bar";
    {
      match: and(isWayfinderModule, moduleName(startsWith("screens"))),
      sort: moduleName(naturally)
    },
    { separator: true },

    // import { bar } from "components/bar";
    {
      match: and(isWayfinderModule, moduleName(startsWith("component"))),
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
