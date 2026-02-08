<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once "core/core.php";

$endpoint = $_GET['endpoint'] ?? '';
$id = $_GET['id'] ?? '';
$page = $_GET['page'] ?? 1;

$userId = getRecentUserId();
$file = __DIR__ . '/data/recent.json';
$json = loadRecentJson($file);


try {
    switch ($endpoint) {
        case 'home':
            $data = get("home");
            echo json_encode($data);
            break;

        case 'get_recent':
            $recent = getUserRecent($json, $userId);
            echo json_encode(['status' => 'success', 'data' => $recent]);
            break;


        case 'anime':
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Anime ID required']);
            } else {
                $data = get("anime/$id");
                echo json_encode($data);
            }
            break;

        case 'episode':
            // In the React app, we pass 'ep' as the episodeId
            $ep = $_GET['ep'] ?? '';
            if (empty($ep)) {
                http_response_code(400);
                echo json_encode(['error' => 'Episode ID required']);
            } else {
                // Legacy streaming.php: get("episode/$parts[2]") 
                $data = get("episode/$ep");
                echo json_encode($data);
            }
            cleanExpiredUsers($json, 7, 'hari');

            $pos = get('anime/' . $data['data']['animeId']);
            $href = $data['data']['animeId'] . '/' . $ep;
            $newRecent = [
                "title" => $data['data']['title'],
                "animeId" => $data['data']['animeId'],
                "poster" => $pos['data']['poster'],
                "href" => $href
            ];
            addRecent($json, $userId, $newRecent);
            saveRecentJson($file, $json);

            break;

        case 'schedule':
            $data = get("schedule");
            echo json_encode($data);
            break;

        case 'ongoing':
            $pageParam = $page > 1 ? "?page=$page" : "";
            $data = get("ongoing-anime" . $pageParam);
            echo json_encode($data);
            break;

        case 'complete':
            $pageParam = $page > 1 ? "?page=$page" : "";
            $data = get("complete-anime" . $pageParam);
            echo json_encode($data);
            break;

        case 'server':
            $server_id = $_GET['server_id'] ?? '';
            if (empty($server_id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Server ID required']);
            } else {
                // Legacy streaming.php: get("server/$parts[3]")
                $data = get("server/$server_id");
                echo json_encode($data);
            }
            break;

        case 'search':
            $query = $_GET['query'] ?? '';
            if (empty($query)) {
                http_response_code(400);
                echo json_encode(['error' => 'Query required']);
            } else {
                $data = get("search/$query?page=$page");
                echo json_encode($data);
            }
            break;

        case 'genre':
            $id = $_GET['id'] ?? '';
            $page = $_GET['page'] ?? 1;

            if (empty($id)) {
                // Return list of genres from local file
                $jsonPath = __DIR__ . '/data/genre.json';
                if (file_exists($jsonPath)) {
                    $jsonContent = file_get_contents($jsonPath);
                    $data = json_decode($jsonContent, true);
                    echo json_encode($data);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Genre data file not found']);
                }
            } else {
                // Return anime list for specific genre
                // mimic streamgenre.php: get("genre/$parts[2]$page")
                $pageParam = $page > 1 ? "?page=$page" : "";
                $data = get("genre/$id" . $pageParam);
                echo json_encode($data);
            }
            break;

        case 'log_recent':
            // Get data from POST or GET
            $input = json_decode(file_get_contents('php://input'), true);

            $animeId = $input['animeId'] ?? $_GET['animeId'] ?? '';
            $title = $input['title'] ?? $_GET['title'] ?? '';
            $poster = $input['poster'] ?? $_GET['poster'] ?? '';
            $href = $input['href'] ?? $_GET['href'] ?? '';

            if (empty($animeId) || empty($title) || empty($poster)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields (animeId, title, poster)']);
            } else {
                // If href is missing, generate default
                if (empty($href)) {
                    $href = "$animeId";
                }

                // Strip leading slash to prevent double slash in URLs
                $href = ltrim($href, '/');

                $newRecent = [
                    "title" => $title,
                    "animeId" => $animeId,
                    "poster" => $poster,
                    "href" => $href,
                    "currentTime" => $input['currentTime'] ?? $_GET['currentTime'] ?? 0,
                    "duration" => $input['duration'] ?? $_GET['duration'] ?? 0
                ];

                addRecent($json, $userId, $newRecent);
                cleanExpiredUsers($json, 7, 'hari');
                saveRecentJson($file, $json);

                echo json_encode(['status' => 'success', 'data' => $newRecent]);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
