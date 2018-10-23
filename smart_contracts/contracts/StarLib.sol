pragma solidity ^0.4.23;

library StarLib {
    function strCompare(string s1, string s2) public pure returns(int16) {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);

        // s1 == s2 ==> ret = 0
        // s1 <  s2 ==> ret < 0
        // s1 >  s2 ==> ret > 0
        int16 ret = 0;

        if (b1.length != b2.length) {
            if (b1.length < b2.length) {
                ret = -1;
            }
            else {
                ret = 1;
            }
            return ret;
        }

        for (uint i=0; i<b1.length; i++) {
            if (b1[i] < b2[i]) {
                ret = -1;
                break;
            }
            else if (b1[i] > b2[i]) {
                ret= 1;
                break;
            }
        }

        return ret;
    }
}
