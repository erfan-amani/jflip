<?php
    header("Access-Control-Allow-Origin: *");

    $s = $_GET['value'];
    $_array = json_decode($s , true);
    
////////////////////////////////////////////
    
// start
    $start = $_array['start'];
    
///////////////////////////////////////////

// make state array 

    $_states = [];
    for ($index = 0; $index < count($_array['states']); $index++) {
        $_states [$index] = $_array['states'][$index];
    }
    
///////////////////////////////////////////

// make transition array 
    $_transition = [];
    for ($index = 0; $index < count($_array['transitions']); $index++) {
        $_transition [$index] = $_array['transitions'][$index];
    }
    
    
////////////////////////////////////////////
    
// make acept array     
   // echo '</br>';
    $_accepts = [];
    for ($index = 0; $index < count($_array['accept']); $index++) {
        $_accepts [$index] = $_array['accept'][$index];
    }

////////////////////////////////////////////

 // make alphabet array  
    $_alphabet = [];
    $i = 0;
    $_alphabet [0] = $_array['transitions'][0]['symbol'];
    for ($index = 1; $index < count($_array['transitions']); $index++) {
         if (! (in_array($_array['transitions'][$index]['symbol'],$_alphabet )))
         {$i++;
         $_alphabet [$i] = $_array['transitions'][$index]['symbol'];}
    }
    if (!( in_array("E",$_alphabet )))
        {$_alphabet [count($_alphabet)] = 'E';}
   
////////////////////////////////////////////
//chek if it is  not DFA 
        
    $endcondition = 0;
    $_origionalphabet = [];
    $h = 0;
    $_origionalphabet [0] = $_array['transitions'][0]['symbol'];
    for ($index = 1; $index < count($_array['transitions']); $index++) {
         if (! (in_array($_array['transitions'][$index]['symbol'],$_origionalphabet )))
         {$h++;
         $_origionalphabet [$h] = $_array['transitions'][$index]['symbol'];}
    }
    
    for ($index = 0; $index < count($_transition); $index++) {
        for ($index1 = 0; $index1 < count($_transition); $index1++) {
            if ($index == $index1) {continue;}
            if( $_transition[$index]['symbol'] == $_transition[$index1]['symbol'] && $_transition[$index]["source"] == $_transition[$index1]["source"] && $_transition[$index]["target"] !== $_transition[$index1]["target"] )
            {
               $endcondition++; 
            }
            
        }
    
     }
     
     if (!( in_array("E",$_origionalphabet )) && $endcondition == 0)
     {
        if(!empty($s)){
            // print_r($s);
        }else
        {die("unable to write data !");} 
        die('null');
     }
     
     
/////////////////////////////////////////////////     
//Make transtions tabale :

  $_transtiontable = [];
  
  for ($index = 0; $index < count($_states); $index++) {
      
    $_transtiontable[$index][0] = is_Final($_states[$index]); 
    $_transtiontable[$index][1] = is_Initial($_states[$index]);
    $_transtiontable[$index][2] = $_states[$index] ; 
    
    for ($index1 = 0; $index1 < count($_alphabet); $index1++) {
        $_transtiontable[$index][$index1 + 3] = toWhereGoWith($_states[$index] , $_alphabet[$index1]);
    }
            
} 

    
/////////////////////////////////////////////////////// 
// takmil gozar khali
    $Enum = 3 + array_keys($_alphabet, "E")[0];
        for ($index = 0; $index < count($_states); $index++){
            
            
            if (($_transtiontable[$index][$Enum] !== ''))
               {
                  $Ecopy = [];
                  $k = 0;
                  $dynamicE = explode(',', $_transtiontable[$index][$Enum]);
                  $standE = $_transtiontable[$index][$Enum];
                  while (!(count($dynamicE) <= 0)) {                 
                      $s1 = $dynamicE[0];
                      
                      $nextE = $_transtiontable[array_keys($_states, $s1)[0]][$Enum];
                      $s2 = explode(',', $nextE);
                      
                        for ($index2 = 0; $index2 < count($s2); $index2++) {
                            if($s2[$index2] !=='' && !(in_array($s2[$index2],explode(',',$standE))))
                              {$standE = $standE.','.$s2[$index2];}
                        }
                        $Ecopy[$k] = $s1;
                        $dynamicE = explode(',',$standE);
                        for ($index3 = 0; $index3 <= $k; $index3++) {
                              unset( $dynamicE[0] );
                              $dynamicE = array_values($dynamicE);
                        }                    
                        $k++;
                    
                    }
                  $_transtiontable[$index][$Enum] = implode(',', $Ecopy);
               }
                 
        }

//////////////////////////////////////////////////////
//hazf gozar khali
for ($index0 = 0; $index0 < count($_states); $index0++) {
   
    
    if(($_transtiontable[$index0][$Enum] !== ''))
        {
          
           for ($index1 = 3; $index1 < count($_alphabet)+3 ; $index1++) {
               
                if($index1 !== $Enum)
                {
                    $castE = $_transtiontable[$index0][$index1];
                    $setfinal = $_transtiontable[$index0][0];
                   // $setfinal = FALSE ;
                    
                    for ($index2 = 0; $index2 < count(explode(',',$_transtiontable[$index0][$Enum])); $index2++) {
                    if( $_transtiontable[(array_keys($_states,explode(',',$_transtiontable[$index0][$Enum])[$index2])[0])][$index1] == '' || $_transtiontable[(array_keys($_states,explode(',',$_transtiontable[$index0][$Enum])[$index2])[0])][$index1] == ',' ){
                    continue;}   
                    $castE = $castE.','.$_transtiontable[(array_keys($_states,explode(',',$_transtiontable[$index0][$Enum])[$index2])[0])][$index1];
                   // $setfinal = ( $setfinal || $_transtiontable[(array_keys($_states,explode(',',$_transtiontable[$index0][$Enum])[$index2])[0])][0] );

                    }
                    for ($index4 = 0; $index4 <count(explode(',',$_transtiontable[$index0][$Enum])); $index4++) {
                      $setfinal = ( $setfinal || $_transtiontable[(array_keys($_states,explode(',',$_transtiontable[$index0][$Enum])[$index4])[0])][0] );  
                    }

                    $endofproses = implode(',' , array_values(array_unique(explode(',', $castE)))) ;
                    if($endofproses == '') {
                    $_transtiontable[$index0][$index1] = $endofproses ;   
                    $_transtiontable[$index0][0] = $setfinal ;   
                    }else {
                   // if($endofproses[0] == ',') {$endofproses[0] = '';}
                    if($endofproses[0] == ',') {$endofproses = substr($endofproses, 1);}    
                    if(($endofproses[strlen($endofproses)-1]) == ',') {$endofproses = substr($endofproses,0,-1);} 
                    $_transtiontable[$index0][$index1] = $endofproses ;   
                    $_transtiontable[$index0][0] = $setfinal ;
                    }

                }
                
            }

        }
        
        
    $_transtiontable[$index0][$Enum] = '' ; 
      
}
/////////////////////////////////////////////////   
//make ubdated accepts
    $newaccept =[];
    $q = 0 ;
    for ($index0 = 0; $index0 < count($_states); $index0++) {
      if($_transtiontable[$index0][0]){
          $newaccept[$q] = $_transtiontable[$index0][2];
          $q++;        
      }
}
   
////////////////////////////////////////////////////////
// edgham gozar haye khali 
// crate old array .
    $y = 0 ;
    $z = 0 ;
    $justfirst = 1;
    $oldtemp[0] = $_transtiontable[0][2];
    while (TRUE) { 
        $finishnum = 0;
        for ($index0 = 3; $index0 < count($_alphabet)+ 3 ; $index0++) {
            if ($index0 == $Enum) {continue;}
            $comestr = make_comestr($z , $index0);
            if ($comestr == 'TRAP' && $justfirst == 1)
            {
              $oldtemp[$y+1] = $comestr ;
              $y++; 
              $justfirst = 2;
            }
    
            if(is_comestrUniqe($comestr))
            {
              $oldtemp[$y+1] = $comestr ;
              $y++;
              
            }
            if(!is_comestrUniqe($comestr) || $comestr == 'TRAP'){ $finishnum++; }  
           
        }
        if($finishnum == count($_alphabet)-1   && $z == count($oldtemp)-1){ break;}
        ++$z;
    }

    
///////////////////////////////////////////////
// make finaql transition tabel    
$finalTabel = []; 
for ($index0 = 0; $index0 < count($oldtemp); $index0++) {
    $finalTabel[$index0][0]= is_strFinal($oldtemp[$index0]);
    $finalTabel[$index0][1]= is_Initial($oldtemp[$index0]);
    if($oldtemp[$index0] == 'TRAP'){$finalTabel[$index0][2]= 'TRAP';}
    else {$finalTabel[$index0][2]= $index0;}
    for ($index1 = 3; $index1 < count($_alphabet)+3; $index1++) {
        if($index1 == $Enum){
           $finalTabel[$index0][$index1] = 'emptyE';   
           continue ;
        }
        else {
          $whatfill = make_comestr($index0, $index1);
          if($whatfill == 'TRAP'){$finalTabel[$index0][$index1] = 'TRAP';}
          else {$finalTabel[$index0][$index1] = (array_keys($oldtemp, $whatfill)[0]);}
            
        }
    }
    
    $finalTabel[$index0]['old'] = $oldtemp[$index0];
    
    
}
    
//////////////////////////////////////////// 
//make ubdated accepts
    $finalaccept =[];
    $w = 0 ;
    for ($index0 = 0; $index0 < count(array_column($finalTabel , 2)); $index0++) {
      if($finalTabel[$index0][0]){
          $finalaccept[$w] = $finalTabel[$index0][2];
          $w++;        
      }
   }
//////////////////////////////////////////
//make final transtiotion
$finalTransition = [];
$t = 0;
for ($index0 = 0; $index0 < count(array_column($finalTabel , 2)); $index0++) {
    for ($index2 = 3; $index2 < count($_alphabet)+ 3; $index2++) {
        
        if($index2 !== $Enum){
           $finalTransition[$t]["symbol"] = $_alphabet[$index2-3];
           $finalTransition[$t]["source"] = $finalTabel[$index0][2]; 
           $finalTransition[$t]["target"] = $finalTabel[$index0][$index2];
           $t++;
        }
        
    }
}
//make json output file of dfa 

    $my_dfa = [
        "states" => array_column($finalTabel , 2), 
        "transitions"=> $finalTransition,
        "start" => array_keys($oldtemp, $start)[0],
        "accept" => $finalaccept
        ];
      
        $my_dfa_json = json_encode($my_dfa);
    
        if(!empty($my_dfa_json)){
        //     $handle = fopen('output.json', 'w');
        //  fwrite($handle, $my_dfa_json);
            print_r($my_dfa_json);
        }else
        {die("unable to write data !");}

    
//////////////////////////////////////////////////////
// functions :
// is inti function
         function is_Initial($thestate) {
             global $start;
             if($thestate ===  $start) {return TRUE;}
                else {return FALSE;}                     
         } 
         
// is final function 
         function is_Final($thestate) {
              global $_accepts;
              if ( in_array($thestate,$_accepts )){ return TRUE;}
                  else { return FALSE;}                       
           } 
// to where go with the alphabet 
         function toWhereGoWith($thestate , $thealphabet) {
              global $_transition;
              $return_value = '';
              $flag = FALSE;
              for ($index2 = 0; $index2 < count($_transition); $index2++) {
                if(($_transition[$index2]['source'] === $thestate) && ($_transition[$index2]['symbol'] === $thealphabet)){ $return_value = $return_value.$_transition[$index2]['target'].',';
                $flag = TRUE;
                } 
               
              }        
              if ($flag)  {return  substr($return_value, 0, -1);}
              else { return $return_value ; }                   
         } 
 
// is final function with array input 
         function is_strFinal($str) {
             if($str == 'TRAP'){ return FALSE;}
             else{
              global $newaccept;
              
              $ss = explode(',', $str);
              for ($index = 0; $index < count($ss); $index++) {
                  if ( in_array($ss[$index],$newaccept )){ return TRUE;}
                   
              }
              return FALSE; 
             }
       
           }
           
// looking that the come str is uniqe or not 
         function is_comestrUniqe($str) {
            if ($str == 'TRAP'){ return False;}
            $tempbool = TRUE;
            $temp = TRUE;
            global $oldtemp; 
            for ($index = 0; $index < count( $oldtemp); $index++) {
                //$temp = TRUE && count(array_diff(explode(',', $str), explode(',',$oldtemp[$index] )));
                
                if (count(array_diff(explode(',', $str), explode(',',$oldtemp[$index] ) )) == 0  && count(array_diff(explode(',',$oldtemp[$index] ), explode(',', $str) )) == 0){$tempbool = FALSE;}
                else {$tempbool = TRUE;}
                $temp = $temp && $tempbool; 
                
              }                  
            if (($temp) ){return TRUE;}     
            else {return FALSE ;}
            
            
            //!(count(array_diff($str, $str2 )) == 0  && count(array_diff($str2, $str )) ==0 )
   
            } 
          
// create comestr used in standardiziation part 
          function make_comestr($counter , $alphnum) {
              global $oldtemp ;
              global $_states ;
              global $_transtiontable;
              $thestr = '';
              
             if($oldtemp[$counter] === 'TRAP'){
                 return 'TRAP';}
             else{
                  $arr1 = explode(',', $oldtemp[$counter]);
                  for ($ii = 0; $ii < count($arr1); $ii++) {
                       if((array_key_exists(0, array_keys($_states, $arr1[$ii])))){
                            $statenum = (array_keys($_states, $arr1[$ii])[0]);
                            $thestr = $thestr.$_transtiontable[$statenum][$alphnum].',';
                        }               
                    }    
                $finalthestr = implode(',',array_values(array_unique(explode(',', $thestr))));
                if($finalthestr === '') {return 'TRAP';}
                if($finalthestr[0] === ',') {$finalthestr = substr($finalthestr, 1);}
                if(($finalthestr[strlen($finalthestr)-1]) === ',') {$finalthestr = substr($finalthestr,0,-1);}
                if($finalthestr === '') {return 'TRAP';}
                $finalthestr2 = preg_replace("/[^A-Za-z0-9 , ]/", '', $finalthestr);
                $sss = array_values(array_unique(explode(',',$finalthestr2)));
                sort($sss);
                $finalthestr3 =  implode(',', $sss ) ;
                return $finalthestr3;
                
              }
          }
