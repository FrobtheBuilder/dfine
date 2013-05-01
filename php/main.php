<?php
$db = new SQLite3("../db/db.db", SQLITE3_OPEN_READWRITE);
order($db);

switch ($_POST['action']) {
    
    case "add":
        add($db);
        break;
    case "getpop":
        getPop($db);
        break;
    case "getrand":
        getRand($db);
        break;
    case "vote":
        vote($db, $_POST['how'], $_POST['target']);
        break;
    default:
        test();
}

function add($db) {
    if (!$db) { 
        die("error opening sqlite db");
    }
    
    $isit = $db->escapeString($_POST['isit']);
    $body = $db->escapeString($_POST['body']);
    $type = $db->escapeString($_POST['type']);
    if (strlen($isit) > 20 || strlen($body) > 500) {
        echo "No, too long.";
    }
    else {
        $db->exec("insert into entries (isit, body, yes, no, pop, type) values ('".$isit."', '".$body."', 0, 0, 0, '".$type."');");
        $result = $db->query("select * from entries;");
        header("Location: ../index.html");
        var_dump($result->fetchArray());
    }
}

function getPop($db) {
    $rows = array();
    $tablelength = $db->query("select count(*) from ordered")->fetchArray()[0];
    header("Content-Type: text/plain");
    
    for ($i=1; $i<=$tablelength; $i++) {
        $rows[$i] = $db->query("select * from ordered where rowid=".$i.";")->fetchArray(SQLITE3_ASSOC);
    }
    echo json_encode($rows);
}

function order($db) {
    $db->exec("update entries set pop=yes+no;");
    $db->exec("drop table ordered");
    $db->exec("create table ordered as select * from entries order by pop desc");
}

function vote($db, $how, $target) {
    $db->exec("update entries set ".$how."=".$how."+1 where id=".$target.";");
    $result = $db->query("select yes, no, pop from entries where id=".$target.";")->fetchArray();
    order($db);
    echo json_encode($result);
}
?>