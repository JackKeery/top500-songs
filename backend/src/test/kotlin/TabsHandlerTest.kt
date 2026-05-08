import kotlinx.serialization.json.Json
import org.http4k.core.Method.GET
import org.http4k.core.Request
import org.http4k.core.Status
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class TabsHandlerTest {

    @Test
    fun `returns 200 with tabs from repository`() {
        val repository = TabsRepository { listOf("Top500", "Alice", "Bob") }

        val response = tabsHandler(repository)(Request(GET, "/api/tabs"))

        assertEquals(Status.OK, response.status)
        val tabs = Json.decodeFromString<List<String>>(response.bodyString())
        assertEquals(listOf("Top500", "Alice", "Bob"), tabs)
    }

    @Test
    fun `returns 500 on repository error`() {
        val repository = TabsRepository { error("Sheets API unavailable") }

        val response = tabsHandler(repository)(Request(GET, "/api/tabs"))

        assertEquals(Status.INTERNAL_SERVER_ERROR, response.status)
    }
}
