import org.http4k.core.Method.GET
import org.http4k.routing.ResourceLoader
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.routing.static
import org.http4k.server.Undertow
import org.http4k.server.asServer

fun main() {
    val client = sheetsClient()
    val app = routes(
        "/api/songs" bind GET to songsHandler(googleSheetsRepository(client)),
        "/api/tabs" bind GET to tabsHandler(googleSheetsTabsRepository(client)),
        static(ResourceLoader.Classpath("public"))
    )

    app.asServer(Undertow(8080)).start().also {
        println("Server started on http://localhost:8080")
    }.block()
}
