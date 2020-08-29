## Repro

**Note**: for this repro you need to have a domain you have control of, where you can change
the DNS settings for NS records.

```sh
export ZONE_NAME=example.com ## set your domain here

cdk deploy -c zoneName=$ZONE_NAME
```

The deploy will "stall" at this point. But there is no error or warning.

Now you need to go into your registrar for the domain and update the NS records.

You can obtain the NS records from the Route 53 Hosted Zones section: https://console.aws.amazon.com/route53/v2/hostedzones

After you change the NS settings, certificate will take a couple of minutes to change the status to "Issued".

You can track progress on this screen:

https://ap-southeast-1.console.aws.amazon.com/acm/home

After another few minutes CF should deploy, and `cdk deploy` command exists.

Now you can attempt to destroy:

```sh
cdk destroy -f -c zoneName=$ZONE_NAME
```

Which should trigger the following errors:

```
CdkHostedZoneStack: destroying...
1:54:26 PM | DELETE_FAILED        | AWS::Route53::HostedZone             | RootHostedZone
The specified hosted zone contains non-required resource record sets  and so cannot be deleted. (Service: AmazonRoute53; Status Code: 400; Error Code: HostedZoneNotEmpty; Request ID: a0a25c10-2cae-4c51-8153-
e65173997cdf; Proxy: null)
1:54:27 PM | DELETE_FAILED        | AWS::CloudFormation::Stack           | CdkHostedZoneStack
The following resource(s) failed to delete: [RootHostedZone28FAB023].

 ❌  CdkHostedZoneStack: destroy failed Error: The stack named CdkHostedZoneStack is in a failed state. You may need to delete it from the AWS console : DELETE_FAILED (The following resource(s) failed to delete: [RootHostedZone28FAB023]. )
    at Object.waitForStackDelete (/Users/foo/.nvm/versions/node/v12.18.2/lib/node_modules/aws-cdk/lib/api/util/cloudformation.ts:264:11)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at Object.destroyStack (/Users/foo/.nvm/versions/node/v12.18.2/lib/node_modules/aws-cdk/lib/api/deploy-stack.ts:372:28)
    at CdkToolkit.destroy (/Users/foo/.nvm/versions/node/v12.18.2/lib/node_modules/aws-cdk/lib/cdk-toolkit.ts:252:9)
    at main (/Users/foo/.nvm/versions/node/v12.18.2/lib/node_modules/aws-cdk/bin/cdk.ts:286:16)
    at initCommandLine (/Users/foo/.nvm/versions/node/v12.18.2/lib/node_modules/aws-cdk/bin/cdk.ts:188:9)
The stack named CdkHostedZoneStack is in a failed state. You may need to delete it from the AWS console : DELETE_FAILED (The following resource(s) failed to delete: [RootHostedZone28FAB023]. )
````

To clean up you need to delete the `CNAME` record in the Hosted Zones manually.

After the manual clean up you may continue to destroy using the CLI.