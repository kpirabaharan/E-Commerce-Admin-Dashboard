import { SSTConfig } from 'sst';
import { NextjsSite, Bucket } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'Admin-Dashboard',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const bucket = new Bucket(stack, 'public');
      
      const site = new NextjsSite(stack, 'site', {
        environment: { DATABASE_URL: process.env.DATABASE_URL ?? '' },
        bind: [bucket],
      });
      
      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
