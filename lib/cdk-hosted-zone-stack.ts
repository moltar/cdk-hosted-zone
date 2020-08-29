import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53'
import {
  Certificate,
  CertificateValidation,
  ValidationMethod,
} from '@aws-cdk/aws-certificatemanager'

export class CdkHostedZoneStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zoneName = this.node.tryGetContext('zoneName');

    if (!zoneName) {
      throw new Error('Please set zoneName in cdk.json.')
    }

    const hostedZone = new HostedZone(this, 'RootHostedZone', {
      comment: 'Root domain for the account.',
      zoneName,
    })

    const certificate = new Certificate(this, `${id}Certificate`, {
      domainName: hostedZone.zoneName,
      validation: CertificateValidation.fromDns(hostedZone),
      validationMethod: ValidationMethod.DNS,
    })
  }
}
