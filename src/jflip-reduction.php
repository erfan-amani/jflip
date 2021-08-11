<?php
  header("Access-Control-Allow-Origin: *");
  $json = $_GET['value'];
  $dfa = json_decode($json, true);
  $dfaTransitions = array();
  $dfaTransitions = array();
  $symbols = array();
  $initial = $dfa["start"];
  $completeTable = array(); // use in step 4
  // $symbols = array();

  // 1.create transitions list
  foreach ($dfa['transitions'] as $trs){
    $temp = array(
      $trs['symbol']=> $trs['target'],
      'isFinal'=> in_array($trs['source'], $dfa['accept']),
      'isInitial'=> $dfa['start'] === $trs['source']
    );
    
    if(!isset($dfaTransitions[$trs['source']])) {
      $dfaTransitions[$trs['source']] = [
        $trs['symbol']=> $trs['target'],
        'isFinal'=> in_array($trs['source'], $dfa['accept']),
        'isInitial'=> $dfa['start'] === $trs['source']
      ];
      
    } else {
      $dfaTransitions[$trs['source']][$trs['symbol']] = $trs['target'];
    }
    if(!in_array($trs['symbol'], $symbols)) {
      array_push($symbols, $trs['symbol']);
    }
  }

  // 2.find reachable states
  $reachables = array($initial);
  $count = 0;
  while (count($reachables) != $count) {
    foreach ($symbols as $sym) {
      if (!isset($dfaTransitions[$reachables[$count]][$sym])) {
        $dfaTransitions[$reachables[$count]][$sym] = null;
      } else {
        $val = $dfaTransitions[$reachables[$count]][$sym];
        if (!in_array($val ,$reachables)) array_push($reachables, $val);
      }
      if (!isset($dfaTransitions[$reachables[$count]]['isFinal'])) {
          $dfaTransitions[$reachables[$count]]['isFinal'] = in_array($reachables[$count], $dfa['accept']);
          $dfaTransitions[$reachables[$count]]['isInitial'] = $reachables[$count] == $dfa['start'];
      }
    }
    $count++;
  }
  
  sort($reachables);
  // 3. create transition table
  $transitionTable = array();
  foreach($reachables as $state) {
    $transitionTable[$state] = $dfaTransitions[$state];
    // array_push(, $dfaTransitions[$state]);
  }
  
  $lastHs = array();
  $prevLastHs = array();
  foreach($transitionTable as $key => $state) {
    $val = array();
    array_push($val, $key);
    foreach($symbols as $sym) {
        // array_push($val, $state[$sym]);
      if (isset($state[$sym])) array_push($val, $state[$sym]);
      else array_push($val, 'null');
    }
    array_push($val, $state['isFinal'] ? 1 : 0);
    array_push($lastHs, $val[count($val) - 1]);
    array_push($completeTable, $val);
  }

  do {
    $types = array();
    $prevLastHs = $lastHs;
    $lastHs = array();
    foreach($completeTable as $i => $row) {
      $val = array();
      $newType = strval($prevLastHs[$i]);
      foreach($symbols as $j => $sym) {
          if ($row[$j + 1] == 'null') {
              array_push($val, 'null');
          } else {
              $go = array_search($row[$j + 1], $reachables);
            array_push($val, $prevLastHs[$go]);
            
          }
          $newType .= strval($val[count($val)-1]);
        
      }
      if (!in_array($newType, $types)) array_push($types, $newType);
      array_push($val, array_search($newType, $types));
      array_push($lastHs, $val[count($val)-1]);
      $completeTable[$i] = array_merge($row, $val);
    }
  } while (join('',$lastHs) != join('',$prevLastHs));

  $strigifiedRows = array();
  foreach($completeTable as $row) {
    if ($strigifiedRows == null) {
        $strigifiedRows[0] = join('', array_slice($row, count($symbols)+1, count($row)));
    }
    else {
      array_push($strigifiedRows, join('', array_slice($row, count($symbols)+1, count($row))));
    }
  }
  
  $reapetedStates = array();
  $temp = array();
  foreach($strigifiedRows as $i => $row) {
    if (in_array($row, $temp)) {
      $index = array_search($row, $temp);
      array_push($reapetedStates, array_search($temp[$index], $strigifiedRows), $i);
    } else array_push($temp, $row);
  }
//   if (count($reapetedState) == 0 && $reachables == $dfa['states']) die('null');
  //5.1 delete reapeted rows
  foreach($reapetedStates as $i => $state) {
    if ($i % 2 === 1) {
      unset($transitionTable[$reachables[$state]]);
    } 
  }
  
  //5.2 replace deleted states
  function replaceNumberToString($state) {
    return $GLOBALS['reachables'][$state];
  }
  $reapetedStates = array_map("replaceNumberToString", $reapetedStates);

  foreach($transitionTable as $key => $state) {
    foreach($symbols as $sym) {
      foreach($reapetedStates as $i => $rep) {
        if ($i % 2 == 1) {
          if ($state[$sym] == $rep) {
            $transitionTable[$key][$sym] = $reapetedStates[$i - 1];
          }
        }
      }
    }
  }

  //6. make the table standard - last step to prepare the output
  $newTransitionTable = array();
  $oldStatesName = array($initial);
  $counter = 0;
  $states = array();
  foreach($transitionTable as $key => $state) {
    array_push($states, $key);
  }
  while ($counter < count($states)) {
    $state = $oldStatesName[$counter];
    if ($state != null && !in_array($state, $oldStatesName)) array_push($oldStatesName, $state);
  
    foreach($symbols as $sym) {
      if (isset($transitionTable[$state][$sym])) {
        $go = $transitionTable[$state][$sym];
        if ($go != null && !in_array($go, $oldStatesName)) {
          array_push($oldStatesName, $go);
        }
        $newTransitionTable[array_search($state, $oldStatesName)][$sym] = array_search($go, $oldStatesName);
      }
    }
    if (isset($transitionTable[$state]['isFinal'])) {
      $newTransitionTable[array_search($state, $oldStatesName)]['isFinal'] = $transitionTable[$state]['isFinal'];
    }
    if (isset($transitionTable[$state]['isInitial'])) {
      $newTransitionTable[array_search($state, $oldStatesName)]['isInitial'] = $transitionTable[$state]['isInitial'];
    }
    
    $counter++;
  }

  // create expected format of output
  $output = array(
    'transitions' => array(), 
    'symbols' => array(), 
    'accept' => array(), 
    'states' => array(),
    'start' => ''
  );
  foreach($newTransitionTable as $stateName => $state) {
    if ($state['isInitial']) $output['start'] = $stateName;
    if ($state['isFinal']) array_push($output['accept'], $stateName);
    if (!in_array($stateName, $output['states'])) array_push($output['states'], $stateName);
    // put transitions
    foreach($symbols as $sym) {
      if(isset($state[$sym])) {
        array_push($output['transitions'], [
          'symbol' => $sym,
          'source' => $stateName,
          'target' => $state[$sym],
        ]);
        if (!in_array($sym, $output['symbols'])) array_push($output['symbols'], $sym);
      }
    }
  }
  
  $outJson = json_encode($output);
  print_r($outJson);