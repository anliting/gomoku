#include<climits>
#include<algorithm>
#include<iostream>
#include<string>
#include<vector>
#include"main/pattern.cpp"
using namespace std;
struct Play{
    int x,y;
};
struct Board{
    char a[15][15];
    Play play();
    vector<int>count(){
        vector<int>x(2,0);
        for(int i=0;i<15;i++)
        for(int j=0;j<15;j++)
        if(a[i][j])
            x[a[i][j]-1]++;
        return x;
    }
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
                blackStep=min(blackStep,1);
            if(contain<2>(pattern::pattern[0]))
                whiteStep=min(whiteStep,0);
        }else{
            if(contain<1>(pattern::pattern[0]))
                blackStep=min(blackStep,0);
            if(contain<2>(pattern::pattern[1]))
                whiteStep=min(whiteStep,1);
        }
        if(blackStep<whiteStep)
            return 1;
        if(whiteStep<blackStep)
            return 3;
        if(c[0]+c[1]==225)
            return 2;
        return 0;
    }
    int calcStateRecursively(int turn,int d=0){
        int state=calcState();
        if(state)
            return state;
        bool unknown=0,draw=0,lose=0;
        if(d<1)
        for(int i=0;i<15;i++)
        for(int j=0;j<15;j++)
        if(a[i][j]==0){
            a[i][j]=turn+1;
            int state=calcStateRecursively(!turn,d+1);
            a[i][j]=0;
            if(state==(turn==0?1:3))
                return state;
            if(state==0)
                unknown=1;
            if(state==2)
                draw=1;
            if(state==(turn==0?3:1))
                lose=1;
        }
        if(unknown)
            return 0;
        if(draw)
            return 2;
        if(lose)
            return(turn==0?3:1);
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
Play Board::play(){
    auto count=Board::count();
    int turn=count[0]==count[1]?0:1;
    for(int i=0;i<15;i++)
    for(int j=0;j<15;j++)
    if(!a[i][j]){
        a[i][j]=turn+1;
        int state=calcStateRecursively(!turn);
        a[i][j]=0;
        if(state==(turn==0?1:3))
            return{i,j};
    }
    for(int i=0;i<15;i++)
    for(int j=0;j<15;j++)
    if(!a[i][j])
        return{i,j};
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
    //cout<<"calculating pattern\n";
    pattern::patternDeduct(1);
    /*pattern::patternDeduct(2);
    pattern::patternDeduct(3);
    cout<<"compeleted calculating pattern\n";
    cout<<pattern::pattern[3].size()<<endl;
    for(auto&p:pattern::pattern[3])
        pattern::visualOutput(cout,p);*/
    srand(time(0));
    Board b;
    cin>>b;
    Play p=b.play();
    cout<<p.x<<' '<<p.y<<'\n';
}
