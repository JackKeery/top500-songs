import org.http4k.core.*
import org.http4k.core.Status.Companion.INTERNAL_SERVER_ERROR
import org.http4k.format.KotlinxSerialization.auto

fun songsHandler(repository: SongsRepository): HttpHandler = {
    try {
        val songs = repository.fetchRows().drop(1).map(::toSong)
        Body.auto<List<Song>>().toLens()(songs, Response(Status.OK))
    } catch (e: Exception) {
        Response(INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body("""{"error":"Failed to fetch songs"}""")
    }
}
