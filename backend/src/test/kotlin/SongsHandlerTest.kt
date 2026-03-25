import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json
import org.http4k.core.Method.GET
import org.http4k.core.Request
import org.http4k.core.Status
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class SongsHandlerTest {

    private val headers = listOf("Rank", "Title", "Artist", "Released", "Rating")

    @Test
    fun `returns 200 with songs as JSON`() {
        val repository = SongsRepository {
            listOf(
                headers,
                listOf("1", "Bohemian Rhapsody", "Queen", "1975", "9.5")
            )
        }

        val response = songsHandler(repository)(Request(GET, "/api/songs"))

        assertEquals(Status.OK, response.status)
        val songs = Json.decodeFromString(ListSerializer(Song.serializer()), response.bodyString())
        assertEquals(1, songs.size)
        assertEquals(Song(rank = "1", title = "Bohemian Rhapsody", artist = "Queen", released = "1975", rating = "9.5"), songs[0])
    }

    @Test
    fun `skips header row`() {
        val repository = SongsRepository {
            listOf(
                headers,
                listOf("1", "Bohemian Rhapsody", "Queen", "1975", "9.5"),
                listOf("2", "Hotel California", "Eagles", "1977", "9.2")
            )
        }

        val response = songsHandler(repository)(Request(GET, "/api/songs"))

        val songs = Json.decodeFromString(ListSerializer(Song.serializer()), response.bodyString())
        assertEquals(2, songs.size)
        assertEquals("1", songs[0].rank)
        assertEquals("2", songs[1].rank)
    }

    @Test
    fun `handles empty sheet`() {
        val repository = SongsRepository { emptyList() }

        val response = songsHandler(repository)(Request(GET, "/api/songs"))

        assertEquals(Status.OK, response.status)
        val songs = Json.decodeFromString(ListSerializer(Song.serializer()), response.bodyString())
        assertEquals(0, songs.size)
    }

    @Test
    fun `returns 500 on repository error`() {
        val repository = SongsRepository { error("Sheets API unavailable") }

        val response = songsHandler(repository)(Request(GET, "/api/songs"))

        assertEquals(Status.INTERNAL_SERVER_ERROR, response.status)
        assertEquals("""{"error":"Failed to fetch songs"}""", response.bodyString())
    }
}

class ToSongTest {

    @Test
    fun `maps a full row to a Song`() {
        val row = listOf("1", "Bohemian Rhapsody", "Queen", "1975", "9.5")

        val song = toSong(row)

        assertEquals(Song(rank = "1", title = "Bohemian Rhapsody", artist = "Queen", released = "1975", rating = "9.5"), song)
    }

    @Test
    fun `handles short row with missing columns`() {
        val row = listOf("42", "Unknown")

        val song = toSong(row)

        assertEquals("42", song.rank)
        assertEquals("Unknown", song.title)
        assertEquals("", song.artist)
        assertEquals("", song.released)
        assertEquals("", song.rating)
    }
}
