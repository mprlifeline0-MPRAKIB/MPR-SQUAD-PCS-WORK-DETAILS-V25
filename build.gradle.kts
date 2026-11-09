plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.mprlifeline.pcs"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.mprlifeline.pcs"
        minSdk = 29
        targetSdk = 35
        versionCode = 28
        versionName = "2.8"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}
