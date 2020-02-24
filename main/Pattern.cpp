#ifndef Pattern_cpp
#define Pattern_cpp
#include<tuple>
#include<vector>
using namespace std;
namespace PatternNS{
    struct PatternElement{
        char x,y,state;
        bool operator<(PatternElement&pe){
            return make_tuple(x,y,state)<make_tuple(pe.x,pe.y,pe.state);
        }
        bool operator==(PatternElement&pe){
            return x==pe.x&&y==pe.y&&state==pe.state;
        }
    };
    typedef vector<PatternElement>Pattern;
    typedef vector<Pattern>PatternLevel;
}
#endif
