#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkHostedZoneStack } from '../lib/cdk-hosted-zone-stack';

const app = new cdk.App();
new CdkHostedZoneStack(app, 'CdkHostedZoneStack');
