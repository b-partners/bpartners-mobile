#import <RCTAppDelegate.h>
#import "RNAppAuthAuthorizationFlowManager.h"

@interface AppDelegate : RCTAppDelegate <RNAppAuthAuthorizationFlowManager>

@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end
