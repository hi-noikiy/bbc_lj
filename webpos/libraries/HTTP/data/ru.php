<?php
$errorCodes = array();
$errorCodes['ru'] = array(
    'TOO_LARGE'            => '&#x424;&#x430;&#x439;&#x43b; &#x441;&#x43b;&#x438;&#x448;&#x43a;&#x43e;&#x43c; &#x432;&#x435;&#x43b;&#x438;&#x43a;. &#x41c;&#x430;&#x43a;&#x441;&#x438;&#x43c;&#x430;&#x43b;&#x44c;&#x43d;&#x44b;&#x439; &#x440;&#x430;&#x437;&#x440;&#x435;&#x448;&#x451;&#x43d;&#x43d;&#x44b;&#x439; &#x43e;&#x431;&#x44a;&#x451;&#x43c;: $maxsize &#x431;&#x430;&#x439;&#x442;.',
    'MISSING_DIR'           => '&#x41d;&#x435; &#x443;&#x43a;&#x430;&#x437;&#x430;&#x43d; &#x446;&#x435;&#x43b;&#x435;&#x432;&#x43e;&#x439; &#x43a;&#x430;&#x442;&#x430;&#x43b;&#x43e;&#x433;.',
    'IS_NOT_DIR'            => '&#x426;&#x435;&#x43b;&#x435;&#x432;&#x43e;&#x439; &#x43a;&#x430;&#x442;&#x430;&#x43b;&#x43e;&#x433; &#x43d;&#x435; &#x441;&#x443;&#x449;&#x435;&#x441;&#x442;&#x432;&#x443;&#x435;&#x442; &#x438;&#x43b;&#x438; &#x44f;&#x432;&#x43b;&#x44f;&#x435;&#x442;&#x441;&#x44f; &#x43e;&#x431;&#x44b;&#x447;&#x43d;&#x44b;&#x43c; &#x444;&#x430;&#x439;&#x43b;&#x43e;&#x43c;.',
    'NO_WRITE_PERMS'        => '&#x41d;&#x435;&#x442; &#x43f;&#x440;&#x430;&#x432; &#x43d;&#x430; &#x437;&#x430;&#x43f;&#x438;&#x441;&#x44c; &#x432; &#x446;&#x435;&#x43b;&#x435;&#x432;&#x43e;&#x439; &#x43a;&#x430;&#x442;&#x430;&#x43b;&#x43e;&#x433;.',
    'NO_USER_FILE'          => '&#x412;&#x44b; &#x43d;&#x435; &#x432;&#x44b;&#x431;&#x440;&#x430;&#x43b;&#x438; &#x444;&#x430;&#x439;&#x43b; &#x434;&#x43b;&#x44f; &#x437;&#x430;&#x433;&#x440;&#x443;&#x437;&#x43a;&#x438;.',
    'BAD_FORM'              => '&#x412; &#x444;&#x43e;&#x440;&#x43c;&#x435; HTML &#x43d;&#x435; &#x443;&#x43a;&#x430;&#x437;&#x430;&#x43d;&#x44b; &#x43d;&#x435;&#x43e;&#x431;&#x445;&#x43e;&#x434;&#x438;&#x43c;&#x44b;&#x435; &#x430;&#x442;&#x440;&#x438;&#x431;&#x443;&#x442;&#x44b;: method="post" enctype="multipart/form-data".',
    'E_FAIL_COPY'           => '&#x41d;&#x435; &#x443;&#x434;&#x430;&#x43b;&#x43e;&#x441;&#x44c; &#x441;&#x43a;&#x43e;&#x43f;&#x438;&#x440;&#x43e;&#x432;&#x430;&#x442;&#x44c; &#x432;&#x440;&#x435;&#x43c;&#x435;&#x43d;&#x43d;&#x44b;&#x439; &#x444;&#x430;&#x439;&#x43b;.',
    'E_FAIL_MOVE'           => '&#x41d;&#x435; &#x443;&#x434;&#x430;&#x43b;&#x43e;&#x441;&#x44c; &#x43f;&#x435;&#x440;&#x435;&#x43c;&#x435;&#x441;&#x442;&#x438;&#x442;&#x44c; &#x444;&#x430;&#x439;&#x43b;',
    'FILE_EXISTS'           => '&#x426;&#x435;&#x43b;&#x435;&#x432;&#x43e;&#x439; &#x444;&#x430;&#x439;&#x43b; &#x443;&#x436;&#x435; &#x441;&#x443;&#x449;&#x435;&#x441;&#x442;&#x432;&#x443;&#x435;&#x442;.',
    'CANNOT_OVERWRITE'      => '&#x426;&#x435;&#x43b;&#x435;&#x432;&#x43e;&#x439; &#x444;&#x430;&#x439;&#x43b; &#x443;&#x436;&#x435; &#x441;&#x443;&#x449;&#x435;&#x441;&#x442;&#x432;&#x443;&#x435;&#x442; &#x438; &#x43d;&#x435; &#x43c;&#x43e;&#x436;&#x435;&#x442; &#x431;&#x44b;&#x442;&#x44c; &#x43f;&#x435;&#x440;&#x435;&#x437;&#x430;&#x43f;&#x438;&#x441;&#x430;&#x43d;.',
    'NOT_ALLOWED_EXTENSION' => '&#x41d;&#x435;&#x434;&#x43e;&#x43f;&#x443;&#x441;&#x442;&#x438;&#x43c;&#x43e;&#x435; &#x440;&#x430;&#x441;&#x448;&#x438;&#x440;&#x435;&#x43d;&#x438;&#x435; &#x444;&#x430;&#x439;&#x43b;&#x430;.',
    'PARTIAL'               => '&#x424;&#x430;&#x439;&#x43b; &#x431;&#x44b;&#x43b; &#x437;&#x430;&#x433;&#x440;&#x443;&#x436;&#x435;&#x43d; &#x43b;&#x438;&#x448;&#x44c; &#x447;&#x430;&#x441;&#x442;&#x438;&#x447;&#x43d;&#x43e;.',
    'ERROR'                 => '&#x41e;&#x448;&#x438;&#x431;&#x43a;&#x430; &#x437;&#x430;&#x433;&#x440;&#x443;&#x437;&#x43a;&#x438;:',
    'DEV_NO_DEF_FILE'       => '&#x42d;&#x442;&#x43e; &#x438;&#x43c;&#x44f; &#x444;&#x430;&#x439;&#x43b;&#x430; &#x43e;&#x442;&#x441;&#x443;&#x442;&#x441;&#x442;&#x432;&#x43e;&#x432;&#x430;&#x43b;&#x43e; &#x432; &#x444;&#x43e;&#x440;&#x43c;&#x435; &#x43a;&#x430;&#x43a; &#x43f;&#x43e;&#x43b;&#x435; &lt;input type="file" name=?&gt;.',
);
?>
