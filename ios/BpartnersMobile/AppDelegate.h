#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <Expo/Expo.h>
#import "RNAppAuthAuthorizationFlowManager.h"

// added the <RNAppAuthAuthorizationFlowManager>
@interface AppDelegate : EXAppDelegateWrapper <RNAppAuthAuthorizationFlowManager>

@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end