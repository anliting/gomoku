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
    void patternDeduct(int);
    void in_getArray(Pattern&,char(&)[15][15]);
    bool in(Pattern&p,Pattern&q){
        char b[15][15]{};
        in_getArray(q,b);
        for(auto&pe:q){
            bool a=0;
            int dx=pe.x-p[0].x,dy=pe.y-p[0].y;
            for(auto&pea:p){
                int x=pea.x+dx,y=pea.y+dy;
                if(!(0<=x&&x<15&&0<=y&&y<15)||b[x][y]!=pea.state+1)
                    a=1;
            }
            if(a==0)
                return 1;
        }
        return 0;
    }
    void in_getArray(Pattern&p,char(&b)[15][15]){
        for(auto&pe:p)
            b[pe.x][pe.y]=pe.state+1;
    }
    void visualOutput(ostream&s,pattern::Pattern&p){
        static string sa[]={" ","┼","●"};
        char xm=0,ym=0;
        for(int i=0;i<p.size();i++){
            xm=max(xm,p[i].x);
            ym=max(ym,p[i].y);
        }
        xm++;
        ym++;
        vector<vector<char>>a(xm,vector<char>(ym,0));
        for(auto e:p)
            a[e.x][e.y]=e.state+1;
        s<<"┌";
        for(int i=0;i<ym;i++)
            s<<"─";
        s<<"┐\n";
        for(int i=0;i<xm;i++){
            s<<"│";
            for(int j=0;j<ym;j++)
                s<<sa[a[i][j]];
            s<<"│\n";
        }
        s<<"└";
        for(int i=0;i<ym;i++)
            s<<"─";
        s<<"┘\n";
    }
}
void pattern::patternDeduct(int n){
    PatternLevel level;
    int m=pattern.size()/2;
    if(n%2){
        for(int i=0;i<pattern[n-1].size();i++)
        for(int j=0;j<pattern[n-1][i].size();j++)
        if(pattern[n-1][i][j].state){
            Pattern p(pattern[n-1][i]);
            p[j].state=0;
            bool bad=0;
            for(int l=0;l<m;l++)for(auto&q:pattern[l*2+1])
                if(pattern::in(q,p))
                    bad=1;
            if(bad)
                continue;
            level.push_back(p);
        }
    }else{
        for(int al=0;al<m;al++)for(auto&ap:pattern[al*2+1])
        for(int bl=0;bl<m;bl++)for(auto&bp:pattern[bl*2+1]){
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
                char xm=CHAR_MAX,ym=CHAR_MAX,xMax=CHAR_MIN,yMax=CHAR_MIN;
                for(auto&pe:p){
                    xm=min(xm,pe.x);
                    ym=min(ym,pe.y);
                    xMax=max(xMax,pe.y);
                    yMax=max(yMax,pe.y);
                }
                if(!(xMax+1-xm<15&&yMax+1-ym<15))
                    continue;
                for(auto&pe:p){
                    pe.x-=xm;
                    pe.y-=ym;
                }
                for(int cl=0;cl<m;cl++)for(auto&cp:pattern[cl*2])
                    if(pattern::in(cp,p))
                        bad=1;
                if(bad)
                    continue;
                level.push_back(p);
                /*pattern::visualOutput(cout,p);
                cout<<"level="<<n<<";"<<(
                    &ap-&pattern[al*2+1][0]
                )<<'/'<<pattern[al*2+1].size()<<';'<<(
                    &bp-&pattern[bl*2+1][0]
                )<<'/'<<pattern[bl*2+1].size()<<'\n';*/
            }
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
    PatternLevel l;
    for(auto&p:level){
        bool a=0;
        for(auto&pa:level)
            if(&pa!=&p&&pattern::in(pa,p))
                a=1;
        if(!a)
            l.push_back(p);
    }
    pattern.push_back(l);
}
#endif
