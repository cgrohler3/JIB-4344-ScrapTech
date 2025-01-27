/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/home` | `/home`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/logDonations` | `/logDonations`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/viewDonations` | `/viewDonations`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/home` | `/home`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/logDonations` | `/logDonations`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/viewDonations` | `/viewDonations`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(auth)'}${'/(tabs)'}/home${`?${string}` | `#${string}` | ''}` | `/home${`?${string}` | `#${string}` | ''}` | `${'/(auth)'}${'/(tabs)'}/logDonations${`?${string}` | `#${string}` | ''}` | `/logDonations${`?${string}` | `#${string}` | ''}` | `${'/(auth)'}${'/(tabs)'}/viewDonations${`?${string}` | `#${string}` | ''}` | `/viewDonations${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/home` | `/home`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/logDonations` | `/logDonations`; params?: Router.UnknownInputParams; } | { pathname: `${'/(auth)'}${'/(tabs)'}/viewDonations` | `/viewDonations`; params?: Router.UnknownInputParams; };
    }
  }
}
