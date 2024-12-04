import 'brace/mode/abap';
import 'brace/mode/assembly_x86';
import 'brace/mode/c_cpp';
import 'brace/mode/clojure';
import 'brace/mode/coffee';
import 'brace/mode/css';
import 'brace/mode/dart';
import 'brace/mode/diff';
import 'brace/mode/django';
import 'brace/mode/dockerfile';
import 'brace/mode/elixir';
import 'brace/mode/elm';
import 'brace/mode/erlang';
import 'brace/mode/fortran';
import 'brace/mode/gherkin';
import 'brace/mode/glsl';
import 'brace/mode/golang';
import 'brace/mode/graphqlschema';
import 'brace/mode/groovy';
// import 'brace/mode/haml';
import 'brace/mode/haskell';
import 'brace/mode/html';
import 'brace/mode/ini';
import 'brace/mode/io';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/jsp';
import 'brace/mode/jsx';
import 'brace/mode/julia';
import 'brace/mode/kotlin';
import 'brace/mode/latex';
import 'brace/mode/less';
// import 'brace/mode/liquid';
import 'brace/mode/lisp';
import 'brace/mode/live_script';
import 'brace/mode/lua';
import 'brace/mode/makefile';
import 'brace/mode/markdown';
import 'brace/mode/matlab';
import 'brace/mode/mel';
import 'brace/mode/mysql';
import 'brace/mode/nix';
import 'brace/mode/objectivec';
import 'brace/mode/ocaml';
import 'brace/mode/pascal';
import 'brace/mode/perl';
import 'brace/mode/pgsql';
import 'brace/mode/php';
import 'brace/mode/plain_text';
import 'brace/mode/powershell';
import 'brace/mode/protobuf';
import 'brace/mode/python';
import 'brace/mode/r';
import 'brace/mode/ruby';
import 'brace/mode/rust';
import 'brace/mode/sass';
import 'brace/mode/scala';
import 'brace/mode/scheme';
import 'brace/mode/scss';
import 'brace/mode/sh';
import 'brace/mode/sql';
import 'brace/mode/sqlserver';
import 'brace/mode/svg';
import 'brace/mode/swift';
// import 'brace/mode/tcl';
// import 'brace/mode/textile';
import 'brace/mode/toml';
import 'brace/mode/typescript';
import 'brace/mode/vbscript';
// import 'brace/mode/velocity';
import 'brace/mode/verilog';
import 'brace/mode/vhdl';
import 'brace/mode/xml';
import 'brace/mode/yaml';

export const aceModes = [
  { value: 'abap', mode: 'ace/mode/abap', label: 'ABAP' },
  { value: 'assembly_x86', mode: 'ace/mode/assembly_x86', label: 'Assembly' },
  { value: 'c_cpp', mode: 'ace/mode/c_cpp', label: 'C/C++' },
  { value: 'clojure', mode: 'ace/mode/clojure', label: 'Clojure' },
  { value: 'coffee', mode: 'ace/mode/coffee', label: 'CoffeeScript' },
  { value: 'css', mode: 'ace/mode/css', label: 'CSS' },
  { value: 'dart', mode: 'ace/mode/dart', label: 'Dart' },
  { value: 'diff', mode: 'ace/mode/diff', label: 'Diff' },
  { value: 'django', mode: 'ace/mode/django', label: 'Django' },
  { value: 'dockerfile', mode: 'ace/mode/dockerfile', label: 'Dockerfile' },
  { value: 'elixir', mode: 'ace/mode/elixir', label: 'Elixir' },
  { value: 'elm', mode: 'ace/mode/elm', label: 'Elm' },
  { value: 'erlang', mode: 'ace/mode/erlang', label: 'Erlang' },
  { value: 'fortran', mode: 'ace/mode/fortran', label: 'Fortran' },
  { value: 'gherkin', mode: 'ace/mode/gherkin', label: 'Gherkin' },
  { value: 'glsl', mode: 'ace/mode/glsl', label: 'GLSL' },
  { value: 'golang', mode: 'ace/mode/golang', label: 'Go' },
  { value: 'graphqlschema', mode: 'ace/mode/graphqlschema', label: 'GraphQL Schema' },
  { value: 'groovy', mode: 'ace/mode/groovy', label: 'Groovy' },
  { value: 'haskell', mode: 'ace/mode/haskell', label: 'Haskell' },
  { value: 'html', mode: 'ace/mode/html', label: 'HTML' },
  { value: 'ini', mode: 'ace/mode/ini', label: 'INI' },
  { value: 'io', mode: 'ace/mode/io', label: 'Io' },
  { value: 'java', mode: 'ace/mode/java', label: 'Java' },
  { value: 'javascript', mode: 'ace/mode/javascript', label: 'JavaScript' },
  { value: 'json', mode: 'ace/mode/json', label: 'JSON' },
  { value: 'jsp', mode: 'ace/mode/jsp', label: 'JSP' },
  { value: 'jsx', mode: 'ace/mode/jsx', label: 'JSX' },
  { value: 'julia', mode: 'ace/mode/julia', label: 'Julia' },
  { value: 'kotlin', mode: 'ace/mode/kotlin', label: 'Kotlin' },
  { value: 'latex', mode: 'ace/mode/latex', label: 'LaTeX' },
  { value: 'less', mode: 'ace/mode/less', label: 'Less' },
  { value: 'lisp', mode: 'ace/mode/lisp', label: 'Lisp' },
  { value: 'live_script', mode: 'ace/mode/live_script', label: 'LiveScript' },
  { value: 'lua', mode: 'ace/mode/lua', label: 'Lua' },
  { value: 'makefile', mode: 'ace/mode/makefile', label: 'Makefile' },
  { value: 'markdown', mode: 'ace/mode/markdown', label: 'Markdown' },
  { value: 'matlab', mode: 'ace/mode/matlab', label: 'MATLAB' },
  { value: 'mel', mode: 'ace/mode/mel', label: 'MEL' },
  { value: 'mysql', mode: 'ace/mode/mysql', label: 'MySQL' },
  { value: 'nix', mode: 'ace/mode/nix', label: 'Nix' },
  { value: 'objectivec', mode: 'ace/mode/objectivec', label: 'Objective-C' },
  { value: 'ocaml', mode: 'ace/mode/ocaml', label: 'OCaml' },
  { value: 'pascal', mode: 'ace/mode/pascal', label: 'Pascal' },
  { value: 'perl', mode: 'ace/mode/perl', label: 'Perl' },
  { value: 'pgsql', mode: 'ace/mode/pgsql', label: 'PostgreSQL' },
  { value: 'php', mode: 'ace/mode/php', label: 'PHP' },
  { value: 'plain_text', mode: 'ace/mode/plain_text', label: 'Plain Text' },
  { value: 'powershell', mode: 'ace/mode/powershell', label: 'PowerShell' },
  { value: 'protobuf', mode: 'ace/mode/protobuf', label: 'Protobuf' },
  { value: 'python', mode: 'ace/mode/python', label: 'Python' },
  { value: 'r', mode: 'ace/mode/r', label: 'R' },
  { value: 'ruby', mode: 'ace/mode/ruby', label: 'Ruby' },
  { value: 'rust', mode: 'ace/mode/rust', label: 'Rust' },
  { value: 'sass', mode: 'ace/mode/sass', label: 'Sass' },
  { value: 'scala', mode: 'ace/mode/scala', label: 'Scala' },
  { value: 'scheme', mode: 'ace/mode/scheme', label: 'Scheme' },
  { value: 'scss', mode: 'ace/mode/scss', label: 'SCSS' },
  { value: 'sh', mode: 'ace/mode/sh', label: 'Shell' },
  { value: 'sql', mode: 'ace/mode/sql', label: 'SQL' },
  { value: 'sqlserver', mode: 'ace/mode/sqlserver', label: 'SQL Server' },
  { value: 'svg', mode: 'ace/mode/svg', label: 'SVG' },
  { value: 'swift', mode: 'ace/mode/swift', label: 'Swift' },
  { value: 'toml', mode: 'ace/mode/toml', label: 'TOML' },
  { value: 'typescript', mode: 'ace/mode/typescript', label: 'TypeScript' },
  { value: 'vbscript', mode: 'ace/mode/vbscript', label: 'VBScript' },
  { value: 'verilog', mode: 'ace/mode/verilog', label: 'Verilog' },
  { value: 'vhdl', mode: 'ace/mode/vhdl', label: 'VHDL' },
  { value: 'xml', mode: 'ace/mode/xml', label: 'XML' },
  { value: 'yaml', mode: 'ace/mode/yaml', label: 'YAML' },
];

export const aceMode = (mode: string) => {
  return aceModes.find(item => item.value === mode) || aceModes.find(item => item.value === 'plain_text') as { mode: string, label: string, value: string };
};
