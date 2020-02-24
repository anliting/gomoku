#include<climits>
#include<iostream>
#include<string>
#include<vector>
#include<algorithm>
using namespace std;
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
struct Score{
    float black,draw,white;
};
struct Board{
    char a[15][15];
    Score score(int t);
    int calcState(){
        if(win<1>())
            return 1;
        if(draw())
            return 2;
        if(win<2>())
            return 3;
        return 0;
    }
    template<int n>bool win(){
        for(int i=0;i<15;i++)
        for(int j=0;j<15;j++){
            bool b=i+4<15,c=j+4<15,d=i+4<15&&j+4<15,e=d;
            for(int k=0;k<5;k++){
                if(b&&a[i+k][j]!=n)
                    b=0;
                if(c&&a[i][j+k]!=n)
                    c=0;
                if(d&&a[i+k][j+k]!=n)
                    d=0;
                if(e&&a[i+k][j+(4-k)]!=n)
                    e=0;
            }
            if(b||c||d||e)
                return 1;
        }
        return 0;
    }
    bool draw(){
        for(int i=0;i<15;i++)
        for(int j=0;j<15;j++)
        if(!a[i][j])
            return 0;
        return 1;
    }
};
istream&operator>>(istream&stream,Board&board){
    for(int i=0;i<15;i++){
        string s;
        stream>>s;
        for(int j=0;j<15;j++)
            board.a[i][j]=s[j]-'0';
    }
    return stream;
}
ostream&operator<<(ostream&stream,Board board){
    stream<<board.calcState()<<'\n';
    for(int i=0;i<15;i++){
        string s;
        s.resize(15);
        for(int j=0;j<15;j++)
            s[j]=board.a[i][j]+'0';
        stream<<s<<'\n';
    }
    stream<<'\n';
    return stream;
}
ostream&operator<<(ostream&stream,Score score){
    stream.precision(2);
    stream<<fixed;
    stream<<"{\n";
    stream<<"    black: "<<score.black<<",\n";
    stream<<"    draw:  "<<score.draw<<",\n";
    stream<<"    white: "<<score.white<<"\n";
    stream<<"}\n";
    return stream;
}
Score Board::score(int t=1024){
    int black=0,white=0;
    for(int i=0;i<15;i++)
    for(int j=0;j<15;j++)
        if(a[i][j]==1)
            black++;
        else if(a[i][j]==2)
            white++;
    int state=calcState();
    if(state==1)
        return{1,0,0};
    if(state==2)
        return{0,1,0};
    if(state==3)
        return{0,0,1};
    Score s{0,0,0};
    for(int k=0;k<t;k++){
        int c=rand()%(15*15-(black+white)),d=0;
        for(int i=0;i<15;i++)
        for(int j=0;j<15;j++)
        if(!a[i][j]&&d++==c){
            a[i][j]=black==white?1:2;
            Score t=score(1);
            s.black+=t.black;
            s.draw+=t.draw;
            s.white+=t.white;
            a[i][j]=0;
            i=14;
            j=14;
        }
    }
    s.black/=t;
    s.draw/=t;
    s.white/=t;
    return s;
}
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
        for(int al=0;al<m;al++)
        for(auto&ap:pattern[al*2+1])
        for(int bl=0;bl<m;bl++)
        for(auto&bp:pattern[bl*2+1])
        for(auto&ape:ap)
        if(ape.state)
        for(auto&bpe:bp)
        if(bpe.state){
            Pattern p=ap;
            char dx=bpe.x-ape.x,dy=bpe.y-ape.y;
            for(auto&pe:bp)
                p.push_back({char(pe.x-dx),char(pe.y-dy),pe.state});
            sort(p.begin(),p.end(),[](auto&a,auto&b){
                return make_tuple(a.x,a.y,a.state)<
                    make_tuple(b.x,b.y,b.state);
            });
            bool bad=0,good=0;
            for(int i=1;i<p.size();i++)
            if(p[i-1].x==p[i].x&&p[i-1].y==p[i].y)
                (p[i-1].state&&p[i-1].state?good:bad)=1;
            if(bad||!good)
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
    sort(level.begin(),level.end(),[](Pattern&a,Pattern&b)->bool{
        if(a.size()!=b.size())
            return a.size()<b.size();
        for(int i=0;i<a.size();i++)
        if(!(a[i]==b[i]))
            return a[i]<b[i];
        return 0;
    });
    level.resize(unique(
        level.begin(),level.end(),[](Pattern&a,Pattern&b)->bool{
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
void visualOutputPattern(ostream&s,vector<PatternElement>&p){
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
void syntaxOutputPattern(ostream&s,vector<PatternElement>&p){
    for(int j=0;j<p.size();j++)
        s<<'{'
            <<(int)p[j].x<<','
            <<(int)p[j].y<<','
            <<(int)p[j].state<<"},"
        ;
    s<<'\n';
}
int main(){
    patternDeduct(1);
    patternDeduct(2);
    cout<<pattern[2].size()<<endl;
    for(int i=0;i<pattern[2].size();i++)
        visualOutputPattern(cout,pattern[2][i]);
    /*srand(time(0));
    Board b;
    cin>>b;
    cout<<b.score();*/
}
