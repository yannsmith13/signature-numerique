<?php
    if($_SERVER['REQUEST_METHOD'] === "POST") {
        // vérification du canvas : est-il vide ?

        $donnees = json_decode(file_get_contents('php://input'), false);

        // On modifie les données en supprimant les éléments indésirables et en reclassant certains éléments dans de nouvelles variables
        list($type, $data) = explode(';', $donnees->image);
        list(, $image) = explode(',', $data);

        // Enregistrement de l'image
        $image_decodee = base64_decode($image);

        $image_name = md5(uniqid()) . '.png';

        // var_dump(__DIR__);
        var_dump(file_put_contents("./assets/images/signatures/$image_name", $image_decodee));
    }
?>