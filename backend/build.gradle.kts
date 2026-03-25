plugins {
    kotlin("jvm") version "2.3.20"
    kotlin("plugin.serialization") version "2.3.20"
    application
    id("com.gradleup.shadow") version "9.4.0"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.http4k:http4k-core:6.15.1.0")
    implementation("org.http4k:http4k-server-undertow:6.15.1.0")
    implementation("org.http4k:http4k-format-kotlinx-serialization:6.15.1.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.1")
    implementation("com.google.apis:google-api-services-sheets:v4-rev20250603-2.0.0")
    implementation("com.google.auth:google-auth-library-oauth2-http:1.35.0")

    testImplementation("org.junit.jupiter:junit-jupiter:5.12.2")
    testImplementation("io.mockk:mockk:1.14.3")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass.set("AppKt")
}

tasks.test {
    useJUnitPlatform()
}
