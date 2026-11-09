plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.mprlifeline.pcs"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.mprlifeline.pcs"
        minSdk = 23
        targetSdk = 35
        versionCode = 33
        versionName = "3.3"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}
