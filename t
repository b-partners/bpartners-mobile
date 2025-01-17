[1mdiff --git a/android/app/src/main/java/com/bpartnersmobile/MainActivity.java b/android/app/src/main/java/com/bpartnersmobile/MainActivity.java.[m
[1msimilarity index 100%[m
[1mrename from android/app/src/main/java/com/bpartnersmobile/MainActivity.java[m
[1mrename to android/app/src/main/java/com/bpartnersmobile/MainActivity.java.[m
[1mdiff --git a/android/app/src/main/java/com/bpartnersmobile/MainActivity.kt b/android/app/src/main/java/com/bpartnersmobile/MainActivity.kt[m
[1mnew file mode 100644[m
[1mindex 0000000..91d58c1[m
[1m--- /dev/null[m
[1m+++ b/android/app/src/main/java/com/bpartnersmobile/MainActivity.kt[m
[36m@@ -0,0 +1,22 @@[m
[32m+[m[32mpackage com.bpartnersmobile[m
[32m+[m
[32m+[m[32mimport com.facebook.react.ReactActivity[m
[32m+[m[32mimport com.facebook.react.ReactActivityDelegate[m
[32m+[m[32mimport com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled[m
[32m+[m[32mimport com.facebook.react.defaults.DefaultReactActivityDelegate[m
[32m+[m
[32m+[m[32mclass MainActivity : ReactActivity() {[m
[32m+[m
[32m+[m[32m  /**[m
[32m+[m[32m   * Returns the name of the main component registered from JavaScript. This is used to schedule[m
[32m+[m[32m   * rendering of the component.[m
[32m+[m[32m   */[m
[32m+[m[32m  override fun getMainComponentName(): String = "BpartnersMobile"[m
[32m+[m
[32m+[m[32m  /**[m
[32m+[m[32m   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate][m
[32m+[m[32m   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled][m
[32m+[m[32m   */[m
[32m+[m[32m  override fun createReactActivityDelegate(): ReactActivityDelegate =[m
[32m+[m[32m      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)[m
[32m+[m[32m}[m
[1mdiff --git a/android/app/src/main/java/com/bpartnersmobile/MainApplication.java b/android/app/src/main/java/com/bpartnersmobile/MainApplication.java.[m
[1msimilarity index 97%[m
[1mrename from android/app/src/main/java/com/bpartnersmobile/MainApplication.java[m
[1mrename to android/app/src/main/java/com/bpartnersmobile/MainApplication.java.[m
[1mindex ebf9a55..2341dbd 100644[m
[1m--- a/android/app/src/main/java/com/bpartnersmobile/MainApplication.java[m
[1m+++ b/android/app/src/main/java/com/bpartnersmobile/MainApplication.java.[m
[36m@@ -47,7 +47,7 @@[m [mpublic class MainApplication extends Application implements ReactApplication {[m
   @Override[m
   public void onCreate() {[m
     super.onCreate();[m
[31m-    SoLoader.init(this, /* native exopackage */ false);[m
[32m+[m[32m    SoLoader.init(this, false);[m
     ApplicationLifecycleDispatcher.onApplicationCreate(this);[m
   }[m
 [m
[1mdiff --git a/android/app/src/main/java/com/bpartnersmobile/MainApplication.kt b/android/app/src/main/java/com/bpartnersmobile/MainApplication.kt[m
[1mnew file mode 100644[m
[1mindex 0000000..1323012[m
[1m--- /dev/null[m
[1m+++ b/android/app/src/main/java/com/bpartnersmobile/MainApplication.kt[m
[36m@@ -0,0 +1,44 @@[m
[32m+[m[32mpackage com.bpartnersmobile[m
[32m+[m
[32m+[m[32mimport android.app.Application[m
[32m+[m[32mimport com.facebook.react.PackageList[m
[32m+[m[32mimport com.facebook.react.ReactApplication[m
[32m+[m[32mimport com.facebook.react.ReactHost[m
[32m+[m[32mimport com.facebook.react.ReactNativeHost[m
[32m+[m[32mimport com.facebook.react.ReactPackage[m
[32m+[m[32mimport com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load[m
[32m+[m[32mimport com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost[m
[32m+[m[32mimport com.facebook.react.defaults.DefaultReactNativeHost[m
[32m+[m[32mimport com.facebook.react.soloader.OpenSourceMergedSoMapping[m
[32m+[m[32mimport com.facebook.soloader.SoLoader[m
[32m+[m
[32m+[m[32mclass MainApplication : Application(), ReactApplication {[m
[32m+[m
[32m+[m[32m  override val reactNativeHost: ReactNativeHost =[m
[32m+[m[32m      object : DefaultReactNativeHost(this) {[m
[32m+[m[32m        override fun getPackages(): List<ReactPackage> =[m
[32m+[m[32m            PackageList(this).packages.apply {[m
[32m+[m[32m              // Packages that cannot be autolinked yet can be added manually here, for example:[m
[32m+[m[32m              // add(MyReactNativePackage())[m
[32m+[m[32m            }[m
[32m+[m
[32m+[m[32m        override fun getJSMainModuleName(): String = "index"[m
[32m+[m
[32m+[m[32m        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG[m
[32m+[m
[32m+[m[32m        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED[m
[32m+[m[32m        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED[m
[32m+[m[32m      }[m
[32m+[m
[32m+[m[32m  override val reactHost: ReactHost[m
[32m+[m[32m    get() = getDefaultReactHost(applicationContext, reactNativeHost)[m
[32m+[m
[32m+[m[32m  override fun onCreate() {[m
[32m+[m[32m    super.onCreate()[m
[32m+[m[32m    SoLoader.init(this, OpenSourceMergedSoMapping)[m
[32m+[m[32m    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {[m
[32m+[m[32m      // If you opted-in for the New Architecture, we load the native entry point for this app.[m
[32m+[m[32m      load()[m
[32m+[m[32m    }[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
