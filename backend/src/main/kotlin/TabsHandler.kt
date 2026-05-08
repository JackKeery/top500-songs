import org.http4k.core.*
import org.http4k.core.Status.Companion.INTERNAL_SERVER_ERROR
import org.http4k.format.KotlinxSerialization.auto

fun tabsHandler(repository: TabsRepository): HttpHandler = {
    try {
        Body.auto<List<String>>().toLens()(repository.fetchTabs(), Response(Status.OK))
    } catch (e: Exception) {
        Response(INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body("""{"error":"Failed to fetch tabs"}""")
    }
}
