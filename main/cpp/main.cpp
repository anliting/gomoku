#include<climits>
#include<algorithm>
#include<iostream>
#include<string>
#include<vector>
#include"main/pattern.cpp"
using namespace std;
struct Score{
    float black,draw,white;
};
struct Board{
    char a[15][15];
    Score score(int t);
    int calcState(){
        int c[2]{};
        for(int i=0;i<15;i++)
        for(int j=0;j<15;j++)
        if(a[i][j])
            c[a[i][j]-1]++;
        bool blackFirst=c[0]==c[1];
        int blackStep=225,whiteStep=225;
        if(blackFirst){
            if(contain<1>(pattern::pattern[1]))
                blackStep=1;
            if(contain<2>(pattern::pattern[0]))
                whiteStep=0;
        }else{
            if(contain<1>(pattern::pattern[0]))
                blackStep=0;
            if(contain<2>(pattern::pattern[1]))
                whiteStep=1;
        }
        if(blackStep<whiteStep)
            return 1;
        if(whiteStep<blackStep)
            return 3;
        if(c[0]+c[1]==225)
            return 2;
        return 0;
    }
    template<int n>bool contain(pattern::PatternLevel&pl){
        for(auto&p:pl)
        for(int i=0;i<15;i++)
        for(int j=0;j<15;j++){
            bool b=0;
            for(auto&pe:p)
            if(!(
                0<=i+pe.x&&i+pe.x<15&&
                0<=j+pe.y&&j+pe.y<15&&
                a[i+pe.x][j+pe.y]==(pe.state?n:0)
            ))
                b=1;
            if(!b)
                return 1;
        }
        return 0;
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
int boardSeen;
Score Board::score(int t=128){
    boardSeen++;
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
void syntaxOutputPattern(ostream&s,pattern::Pattern&p){
    for(int j=0;j<p.size();j++)
        s<<'{'
            <<(int)p[j].x<<','
            <<(int)p[j].y<<','
            <<(int)p[j].state<<"},"
        ;
    s<<'\n';
}
int main(){
    cout<<"calculating pattern\n";
    pattern::patternDeduct(1);
    /*pattern::patternDeduct(2);
    pattern::patternDeduct(3);*/
    cout<<"compeleted calculating pattern\n";
    /*cout<<pattern::pattern[3].size()<<endl;
    for(auto&p:pattern::pattern[3])
        pattern::visualOutput(cout,p);*/
    srand(time(0));
    Board b;
    cin>>b;
    cout<<b.score();
    cout<<boardSeen<<'\n';
}
