import {App, Duration, Stack, StackProps} from 'monocdk';
import * as apigw from 'monocdk/aws-apigateway'
import * as lambda from 'monocdk/aws-lambda';
import * as sns from 'monocdk/aws-sns';
import * as subs from 'monocdk/aws-sns-subscriptions';
import * as sqs from 'monocdk/aws-sqs';
import {HitCounter} from "./constructs/hitcounter";


export class CdkWorkshopStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
            visibilityTimeout: Duration.seconds(300)
        });

        const topic = new sns.Topic(this, 'CdkWorkshopTopic');

        topic.addSubscription(new subs.SqsSubscription(queue));

        // defines an AWS Lambda resource
        const hello = new lambda.Function(this, 'HelloHandler', {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset('lib/lambda'),
            handler: 'hello.handler'
        });

        const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
            downstream: hello
        });

        // defines an API Gateway REST API resource backed by our "hello" function.
        new apigw.LambdaRestApi(this, 'Endpoint', {
            handler: helloWithCounter.handler
        });
    }
}
