import {anything, expect as expectCDK, haveResource, stringLike} from '@monocdk-experiment/assert';
import * as cdk from 'monocdk';
import * as CdkWorkshop from '../lib/cdk-workshop-stack';

test('SQS Queue Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::SQS::Queue", {
        VisibilityTimeout: 300
    }));
});

test('SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::SNS::Topic"));
});


test('Hello Lambda Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
        "Environment": {
            "Variables": {
                "DOWNSTREAM_FUNCTION_NAME": anything(),
                "HITS_TABLE_NAME": anything()
            }
        },
        "Handler": "hitcounter.handler",
        "Runtime": stringLike("nodejs*")
    }));
});
