#ifndef pattern_cpp
#define pattern_cpp
#include<tuple>
#include<vector>
using namespace std;
namespace pattern{
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
    vector<PatternLevel>pattern{{
        {{0,0,1},{0,1,1},{0,2,1},{0,3,1},{0,4,1}},
        {{0,0,1},{1,0,1},{2,0,1},{3,0,1},{4,0,1}},
        {{0,0,1},{1,1,1},{2,2,1},{3,3,1},{4,4,1}},
        {{0,4,1},{1,3,1},{2,2,1},{3,1,1},{4,0,1}},
    }};
    void patternDeduct(int n){
        PatternLevel level;
        if(n%2){
            for(int i=0;i<pattern[n-1].size();i++)
            for(int j=0;j<pattern[n-1][i].size();j++)
            if(pattern[n-1][i][j].state){
                Pattern p(pattern[n-1][i]);
                p[j].state=0;
                level.push_back(p);
            }
        }else{
            int m=pattern.size()/2;
            for(int al=0;al<m;al++)for(auto&ap:pattern[al*2+1])
            for(int bl=0;bl<m;bl++)for(auto&bp:pattern[bl*2+1])
            for(auto&ape:ap)if(ape.state)
            for(auto&bpe:bp)if(bpe.state){
                Pattern p=ap;
                char dx=bpe.x-ape.x,dy=bpe.y-ape.y;
                for(auto&pe:bp)
                    p.push_back({char(pe.x-dx),char(pe.y-dy),pe.state});
                sort(p.begin(),p.end(),[](auto&a,auto&b){
                    return make_tuple(a.x,a.y,a.state)<
                        make_tuple(b.x,b.y,b.state);
                });
                bool bad=0;
                for(int i=1;i<p.size();i++)
                if(
                    p[i-1].x==p[i].x&&
                    p[i-1].y==p[i].y&&
                    !(p[i-1].state&&p[i-1].state)
                )
                    bad=1;
                if(bad)
                    continue;
                p.resize(unique(p.begin(),p.end())-p.begin());
                char xm=CHAR_MAX,ym=CHAR_MAX;
                for(auto&pe:p){
                    xm=min(xm,pe.x);
                    ym=min(ym,pe.y);
                }
                for(auto&pe:p){
                    pe.x-=xm;
                    pe.y-=ym;
                }
                level.push_back(p);
            }
        }
        sort(level.begin(),level.end(),[](
            Pattern&a,Pattern&b
        )->bool{
            if(a.size()!=b.size())
                return a.size()<b.size();
            for(int i=0;i<a.size();i++)
            if(!(a[i]==b[i]))
                return a[i]<b[i];
            return 0;
        });
        level.resize(unique(
            level.begin(),level.end(),[](
                Pattern&a,Pattern&b
            )->bool{
                if(a.size()!=b.size())
                    return 0;
                for(int i=0;i<a.size();i++)
                if(!(a[i]==b[i]))
                    return 0;
                return 1;
            }
        )-level.begin());
        pattern.push_back(level);
    }
}
#endif
